export const SITE = {
  name: "Said Dellioua",
  company: "DS EXPORT",
  phoneDisplay: "0779 31 31 03",
  phoneIntl: "+213779313103",
  whatsapp: "213779313103",
  mapsUrl: "https://maps.app.goo.gl/vBeKPnvNArxyu2sd7",
  spinetUrl: "https://spinet.app/profile/said-dellioua-ryz",
};

export function waLink(text: string) {
  return `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(text)}`;
}

export const IMAGES = {
  port: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?fm=jpg&q=70&w=1600&auto=format&fit=crop",
  ship: "https://images.unsplash.com/photo-1605745341112-85968b19335b?fm=jpg&q=70&w=1600&auto=format&fit=crop",
  containers: "https://images.unsplash.com/photo-1605732562742-3023a888e56e?fm=jpg&q=70&w=1400&auto=format&fit=crop",
  cranes: "https://images.unsplash.com/photo-1769837496184-32831581c55a?fm=jpg&q=70&w=1400&auto=format&fit=crop",
  aerial: "https://images.unsplash.com/photo-1613690399151-65ea69478674?fm=jpg&q=70&w=1400&auto=format&fit=crop",
  stacked: "https://images.unsplash.com/photo-1678182451047-196f22a4143e?fm=jpg&q=70&w=1400&auto=format&fit=crop",
  harbor: "https://images.unsplash.com/photo-1673896493356-6684ede37a7d?fm=jpg&q=70&w=1400&auto=format&fit=crop",
  loaded: "https://images.unsplash.com/photo-1635851801927-44c4d1c555af?fm=jpg&q=70&w=1400&auto=format&fit=crop",
};
