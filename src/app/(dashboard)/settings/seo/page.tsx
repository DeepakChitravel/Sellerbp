import SeoSettings from "@/components/forms/settings/seo-settings";
import { currentUser } from "@/lib/api/users";

const SettingsSEO = async () => {
  const user = await currentUser();

  return (
    <div>
      <div className="mb-9 space-y-1.5">
        <h3 className="font-medium">SEO Settings</h3>
        <p className="text-black/50 text-sm font-medium">
          Update and customize the SEO Settings.
        </p>
      </div>

      <SeoSettings settingsData={user.siteSettings[0]} />
    </div>
  );
};

export default SettingsSEO;
