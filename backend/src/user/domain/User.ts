import Menu from "./value-objects/Menu.js";

export interface User {
  uid: string;
  email: string;
  menu: Menu;
}
