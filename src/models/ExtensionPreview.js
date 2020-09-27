export default class ExtensionPreview {
  id = '';

  name = '';

  icon = '';

  featured = false;

  constructor(data) {
    if (!data.id) {
      throw Error('ExtensionPreview requires Id');
    }

    Object.assign(this, data);
  }
}
