-- Table des actualités du bandeau défilant (à exécuter dans Supabase → SQL Editor)
create table if not exists public.trade_news (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  published_at date not null default current_date,
  organisme text not null check (char_length(organisme) <= 80),
  category text not null default 'actualite' check (category in ('actualite','loi','procedure','evenement','operation')),
  title_fr text not null check (char_length(title_fr) <= 300),
  title_ar text check (char_length(title_ar) <= 300),
  title_en text check (char_length(title_en) <= 300),
  source_label text not null check (char_length(source_label) <= 120),
  url text not null check (url ~ '^https://'),
  published boolean not null default true
);
alter table public.trade_news enable row level security;
drop policy if exists "public read published news" on public.trade_news;
create policy "public read published news" on public.trade_news for select to anon using (published = true);
revoke insert, update, delete on public.trade_news from anon, authenticated;
grant select on public.trade_news to anon;
create index if not exists trade_news_date_idx on public.trade_news (published_at desc);

insert into public.trade_news (published_at, organisme, category, title_fr, title_ar, title_en, source_label, url) values
('2026-10-19','Ministère du Commerce extérieur','evenement','Salon national des dattes du 29 au 31 octobre à Biskra','الصالون الوطني للتمور من 29 إلى 31 أكتوبر ببسكرة','National Date Fair from 29 to 31 October in Biskra','APS','https://www.aps.dz/fr/economie/commerce-et-service/mvfjd65o-le-salon-national-des-dattes-du-29-au-31-octobre-a-biskra'),
('2026-09-24','Ministère du Commerce extérieur','operation','Lancement d''opérations d''exportation d''équipements électroniques et électroménagers depuis El Tarf, Sétif et Bordj Bou Arreridj','انطلاق عمليات تصدير تجهيزات إلكترونية وكهرومنزلية من الطارف وسطيف وبرج بوعريريج','Export operations of electronic and household appliances launched from El Tarf, Sétif and Bordj Bou Arreridj','APS','https://www.aps.dz/fr/economie/commerce-et-service/muftcb3k-lancement-d-operations-d-exportation-d-equipements-electroniques-et-electromenagers-depuis-el-tarf-setif-et-bordj-bou-arreridj'),
('2026-09-21','Port de Ténès','operation','Exportation de plus de 15.000 tonnes de ciment et de clinker via le port de Ténès','تصدير أكثر من 15 ألف طن من الإسمنت والكلنكر عبر ميناء تنس','Over 15,000 tonnes of cement and clinker exported via the port of Ténès','APS','https://www.aps.dz/fr/economie/commerce-et-service/mubc9zky-exportation-de-plus-de-15-000-tonnes-de-ciment-et-de-clinker-via-le-port-de-tenes'),
('2026-08-23','CAGEX','procedure','Délais de paiement entre 120 et 180 jours : la garantie CAGEX devient obligatoire pour les exportations hors hydrocarbures','آجال الدفع بين 120 و180 يومًا: ضمان CAGEX أصبح إلزاميًا لصادرات خارج المحروقات','Payment terms of 120 to 180 days: CAGEX guarantee now mandatory for non-hydrocarbon exports','CAGEX — note aux exportateurs','https://www.cagex.dz'),
('2026-07-23','Banque d''Algérie','loi','Règlement n° 26-02 : rapatriement des recettes d''exportation sous 120 jours (180 jours maximum avec assurance-crédit à l''export)','النظام رقم 26-02: إعادة عائدات التصدير في أجل 120 يومًا (180 يومًا كحد أقصى مع تأمين قرض التصدير)','Regulation No. 26-02: export proceeds to be repatriated within 120 days (180 days max with export credit insurance)','Journal officiel n° 58','https://www.joradp.dz'),
('2026-04-11','Ministère du Commerce extérieur','operation','Lancement d''opérations d''exportation de divers produits locaux vers plusieurs pays','انطلاق عمليات تصدير منتجات محلية متنوعة نحو عدة دول','Export operations of various local products launched to several countries','APS','https://www.aps.dz/fr/economie/commerce-et-service/mnuql62i-lancement-d-operations-d-exportation-de-divers-produits-locaux-vers-plusieurs-pays'),
('2026-03-07','Ministère du Commerce extérieur','operation','Chargement de plus de 15.000 tonnes de fer à béton vers la Lituanie','شحن أكثر من 15 ألف طن من حديد الخرسانة نحو ليتوانيا','Over 15,000 tonnes of rebar loaded for Lithuania','APS','https://www.aps.dz/fr/economie/commerce-et-service/mmgj8owx-chargement-de-plus-de-15-000-tonnes-de-fer-a-beton-vers-la-lituanie');
