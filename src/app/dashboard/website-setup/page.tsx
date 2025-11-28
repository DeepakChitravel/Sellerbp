import { currentUser } from "@/lib/api/users";

const Settings = async () => {
  const user = await currentUser();

  return (
    <div>
      <div className="mb-9 space-y-1.5">
        <h3 className="font-medium">Website Templates</h3>
        <p className="text-black/50 text-sm font-medium">
          Update and customize site templates.
        </p>
      </div>
    </div>
  );
};

export default Settings;
