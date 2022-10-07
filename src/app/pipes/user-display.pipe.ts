import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'userDisplay'
})
export class UserDisplayPipe implements PipeTransform {

    transform(value: any, ...args: any[]) {
        return `${value[0]}`
    };
}