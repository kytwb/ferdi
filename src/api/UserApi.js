import { hash } from '../helpers/password-helpers';

export default class UserApi {
  constructor(server, local) {
    this.server = server;
    this.local = local;
  }

  login(email, password) {
    return this.server.login(email, hash(password));
  }

  logout() {
    return this;
  }

  signup(data) {
    Object.assign(data, {
      password: hash(data.password),
    });
    return this.server.signup(data);
  }

  password(email) {
    return this.server.retrievePassword(email);
  }

  invite(data) {
    return this.server.inviteUser(data);
  }

  getInfo() {
    return this.server.userInfo();
  }

  updateInfo(data) {
    const userData = data;
    if (userData.oldPassword && userData.newPassword) {
      userData.oldPassword = hash(userData.oldPassword);
      userData.newPassword = hash(userData.newPassword);
    }

    return this.server.updateUserInfo(userData);
  }

  getLegacyServices() {
    return this.server.getLegacyServices();
  }

  delete() {
    return this.server.deleteAccount();
  }
}
