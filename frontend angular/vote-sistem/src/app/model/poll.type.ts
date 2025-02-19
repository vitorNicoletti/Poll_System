import { Option } from "./option.type";

export type Poll = {
    id:number;
    title:string;
    start_date:string;
    end_date:string;
    options:Array<Option>;
}