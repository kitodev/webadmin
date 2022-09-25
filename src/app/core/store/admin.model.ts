export interface SettingInterface {
  name: string;
  value: any;
}

export class Setting implements SettingInterface {
  name: string;
  value: any;

  constructor(name: string, value: any) {
    this.name = name;
    this.value = value;
  }
}

export interface AccountInterface {
  email?: string | null;
}

export class Account implements AccountInterface {
  email?: string | null;

  constructor(email?: string) {
    if (email) {
      this.email = email;
    } else {
      this.email = null;
    }
  }
}
