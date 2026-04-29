import data from "./site.json";

export type SiteEvent = {
  id: string;
  title: string;
  date: string | null;
  location: string | null;
  description: string | null;
};

export type SiteTeamMember = {
  role: string;
  name: string;
  icon: string;
  desc: string;
};

export const site = data as {
  organisation: {
    name: string;
    shortName: string;
    tagline: string;
    email: string;
    phone: string;
    location: string;
    hours: string;
  };
  stats: { value: string; label: string }[];
  events: SiteEvent[];
  team: SiteTeamMember[];
  galleryUrl: string;
};
