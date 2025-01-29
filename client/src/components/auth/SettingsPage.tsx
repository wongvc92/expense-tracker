import Sessions from "./Sessions";
import SettingsForm from "./SettingsForm";

const SettingsPage = () => {
  return (
    <div className="max-w-md mx-auto ">
      <div className="px-4 space-y-4">
        <p className="text-center">Settings</p>
        <SettingsForm />
        <Sessions />
      </div>
    </div>
  );
};

export default SettingsPage;
