import { v4 as uuidv4 } from 'uuid';

interface IUserData {
  username: string;
  age: number;
  hobbies: string[];
}

interface IUser extends IUserData {
  id: string;
}

class Users {
  users: IUser[];

  constructor() {
    this.users = [
      {
        id: '2d9a8928-a745-4a5c-878f-a7e3fce115fc',
        username: 'Fuuj',
        age: 33,
        hobbies: [],
      },
      {
        id: '56512149-3576-499d-9aae-d03049e3aa85',
        username: 'Gjhkjh',
        age: 22,
        hobbies: ['hjghjghjg'],
      },
    ];
  }

  getUser(id?: string): string {
    if (id) return JSON.stringify(this.users.find((e) => e.id === id));
    return JSON.stringify(this.users);
  }

  isUser(id: string): boolean {
    return this.users.find((e) => e.id === id) ? true : false;
  }

  deleteUser(id: string): void {
    this.users.splice(
      this.users.indexOf(this.users.find((e) => e.id === id)),
      1
    );
  }

  addUser(user: object): string {
    if (isDataValid(user)) {
      const uuu: IUser = {
        id: uuidv4(),
        username: user.username,
        age: user.age,
        hobbies: user.hobbies,
      };
      this.users.push(uuu);
      return JSON.stringify(uuu);
    } else {
      return '';
    }
  }

  changeUser(user: object, id: string): string {
    if (isDataValid(user)) {
      const uuu: IUser = this.users.find((e) => e.id === id);
      uuu.username = user.username;
      uuu.age = user.age;
      uuu.hobbies = user.hobbies;
      return JSON.stringify(uuu);
    } else {
      return '';
    }
  }
}

const isDataValid = (data: any): data is IUserData => {
  return (
    'username' in data &&
    typeof data.username === 'string' &&
    'age' in data &&
    typeof data.age === 'number' &&
    'hobbies' in data &&
    Array.isArray(data.hobbies) &&
    data.hobbies.every((e: any) => typeof e === 'string')
  );
};

const users = new Users();

export default users;
