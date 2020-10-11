import { systemPreferences } from 'electron';
import {
  hasScreenCapturePermission,
  hasPromptedForPermission,
} from 'mac-screen-capture-permissions';

export default function () {
  systemPreferences.askForMediaAccess('camera');
  systemPreferences.askForMediaAccess('microphone');

  if (!hasPromptedForPermission()) {
    hasScreenCapturePermission();
  }
}
