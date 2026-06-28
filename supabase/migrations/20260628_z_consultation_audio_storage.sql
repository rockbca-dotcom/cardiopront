insert into storage.buckets (id, name, public)
values ('consultation-audio', 'consultation-audio', true)
on conflict (id) do update set
  name = excluded.name,
  public = excluded.public;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'consultation_audio_anon_insert'
  ) then
    create policy consultation_audio_anon_insert
      on storage.objects
      for insert
      to anon
      with check (bucket_id = 'consultation-audio');
  end if;
end $$;
