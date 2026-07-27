-- Narrow public read API for coco-site.
-- Applied to production project wcplwmvbhreevxvsdmog.
-- Exposes only non-sensitive room, availability, and pricing data.

create or replace function public.coco_site_health()
returns jsonb
language sql
stable
security definer
set search_path = ''
as $$
  select jsonb_build_object(
    'ok', true,
    'database', 'connected',
    'rooms', (
      select count(*)
      from mb.rooms r
      where r.active_from <= (now() at time zone 'Asia/Bangkok')::date
        and (r.active_to is null or r.active_to >= (now() at time zone 'Asia/Bangkok')::date)
    ),
    'rate_calendar_through', (
      select max(s.stay_date) from mb.room_nightly_settings s
    )
  );
$$;

create or replace function public.coco_site_room_catalog()
returns table (
  room_code text,
  room_name text,
  room_group_code text,
  max_adults integer,
  max_kids integer,
  max_total_guests integer,
  tags text[],
  view_type text,
  child_friendly boolean,
  active_from date,
  active_to date
)
language sql
stable
security definer
set search_path = ''
as $$
  select
    r.room_code,
    r.room_name,
    r.room_group_code,
    r.max_adults,
    r.max_kids,
    r.max_total_guests,
    coalesce(r.tags, '{}'::text[]),
    r.view_type,
    r.child_friendly,
    r.active_from,
    r.active_to
  from mb.rooms r
  order by r.room_group_code, r.room_code;
$$;

create or replace function public.coco_site_search_rooms(
  p_check_in date,
  p_check_out date,
  p_adults integer default 2,
  p_children integer default 0
)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  v_nights integer;
  v_result jsonb;
begin
  if p_check_in is null or p_check_out is null then
    raise exception 'check-in and check-out are required' using errcode = '22023';
  end if;
  if p_check_out <= p_check_in then
    raise exception 'check-out must be after check-in' using errcode = '22023';
  end if;
  v_nights := p_check_out - p_check_in;
  if v_nights > 90 then
    raise exception 'stays longer than 90 nights are not supported' using errcode = '22023';
  end if;
  if coalesce(p_adults, 0) < 1 or coalesce(p_children, 0) < 0 then
    raise exception 'guest counts are invalid' using errcode = '22023';
  end if;

  with available as (
    select *
    from mb.available_rooms_ranked(p_check_in, p_check_out, p_adults, p_children, null)
  ),
  priced as (
    select
      a.room_code,
      a.room_group_code,
      a.room_name,
      a.max_adults,
      a.max_kids,
      a.max_total_guests,
      coalesce(a.tags, '{}'::text[]) as tags,
      a.view_type,
      a.child_friendly,
      a.active_from,
      a.active_to,
      min(s.minimum_stay_nights) filter (where s.stay_date = p_check_in) as minimum_stay_nights,
      count(s.stay_date)::integer as priced_nights,
      count(*) filter (where s.nightly_rate_thb is null)::integer as null_rate_nights,
      sum(s.nightly_rate_thb)::integer as total_thb,
      jsonb_agg(
        jsonb_build_object('date', d.stay_date, 'rate_thb', s.nightly_rate_thb)
        order by d.stay_date
      ) as nightly_rates
    from available a
    cross join lateral generate_series(
      p_check_in::timestamp,
      (p_check_out - 1)::timestamp,
      interval '1 day'
    ) as gs
    cross join lateral (select gs::date as stay_date) d
    left join mb.room_nightly_settings s
      on s.room_code = a.room_code and s.stay_date = d.stay_date
    group by
      a.room_code, a.room_group_code, a.room_name, a.max_adults, a.max_kids,
      a.max_total_guests, a.tags, a.view_type, a.child_friendly, a.active_from, a.active_to
  )
  select jsonb_build_object(
    'check_in', p_check_in,
    'check_out', p_check_out,
    'nights', v_nights,
    'adults', p_adults,
    'children', p_children,
    'rooms', coalesce(
      jsonb_agg(
        jsonb_build_object(
          'room_code', p.room_code,
          'room_group_code', p.room_group_code,
          'room_name', p.room_name,
          'max_adults', p.max_adults,
          'max_children', p.max_kids,
          'max_total_guests', p.max_total_guests,
          'tags', to_jsonb(p.tags),
          'view_type', p.view_type,
          'child_friendly', p.child_friendly,
          'active_from', p.active_from,
          'active_to', p.active_to,
          'available', true,
          'minimum_stay_nights', p.minimum_stay_nights,
          'minimum_stay_met', p.minimum_stay_nights is not null and v_nights >= p.minimum_stay_nights,
          'price_complete', p.priced_nights = v_nights and p.null_rate_nights = 0,
          'nightly_rates', p.nightly_rates,
          'total_thb', p.total_thb
        )
        order by p.room_group_code, p.room_code
      ),
      '[]'::jsonb
    )
  ) into v_result
  from priced p;

  return coalesce(v_result, jsonb_build_object(
    'check_in', p_check_in,
    'check_out', p_check_out,
    'nights', v_nights,
    'adults', p_adults,
    'children', p_children,
    'rooms', '[]'::jsonb
  ));
end;
$$;

comment on function public.coco_site_health() is
  'Public, read-only health response for coco-site. Returns no sensitive data.';
comment on function public.coco_site_room_catalog() is
  'Public, read-only canonical room catalog for coco-site. Contains no booking or guest data.';
comment on function public.coco_site_search_rooms(date, date, integer, integer) is
  'Public read-only availability and nightly quote response for coco-site. No guest or booking records are exposed.';

revoke all on function public.coco_site_health() from public;
revoke all on function public.coco_site_room_catalog() from public;
revoke all on function public.coco_site_search_rooms(date, date, integer, integer) from public;

grant execute on function public.coco_site_health() to anon, authenticated;
grant execute on function public.coco_site_room_catalog() to anon, authenticated;
grant execute on function public.coco_site_search_rooms(date, date, integer, integer) to anon, authenticated;
