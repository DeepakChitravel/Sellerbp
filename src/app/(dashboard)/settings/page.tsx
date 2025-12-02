import BasicSettings from "@/components/forms/settings/basic-settings";
import { currentUser } from "@/lib/api/users";

const Settings = async () => {
  const user = await currentUser();

  const settingsData =
    user?.siteSettings && Array.isArray(user.siteSettings)
      ? user.siteSettings[0]
      : null;

  return (
    <div>
      <div className="mb-9 space-y-1.5">
        <h3 className="font-medium">Basic Settings</h3>
        <p className="text-black/50 text-sm font-medium">
          Update and customize the basic site settings.
        </p>
      </div>

      <BasicSettings settingsData={settingsData} />
    </div>
  );
};

export default Settings;
