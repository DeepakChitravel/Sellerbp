import HomepageSettings from "@/components/forms/website-setup/homepage-settings/homepage-settings";
import { getWebsiteSettings } from "@/lib/api/website-settings";

const Homepage = async () => {
  const data = await getWebsiteSettings();

  return (
    <div>
      <div className="mb-9 space-y-1.5">
        <h3 className="font-medium">Homepage Settings</h3>
        <p className="text-black/50 text-sm font-medium">
          Update and customize the homepage content.
        </p>
      </div>

      <HomepageSettings data={data} />
    </div>
  );
};

export default Homepage;
