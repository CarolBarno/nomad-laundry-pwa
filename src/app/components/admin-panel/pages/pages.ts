import { NbMenuItem } from "@nebular/theme";

export class MenuItems {
    perms: any[];
    public MENU_ITEMS: NbMenuItem[] | any;
    constructor(perms: any[]) {
        this.perms = perms;
        this.MENU_ITEMS = [
            {
                title: 'Dashboard',
                icon: 'home-outline',
                children: [
                    {
                        title: 'home',
                        link: '/admin',
                        home: true,
                        icon: 'home'
                    }
                ],
            }
        ];
    }

    filterPerms(urls: any[], perms: string[]): any[] {
        return urls.filter(url => url.requirePers === false || perms.includes(url.name));
    }
}