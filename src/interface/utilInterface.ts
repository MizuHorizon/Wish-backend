export interface IUser {
    id? : string;
    name : string;
    email : string;
    username: string;
    profile_pic:string;
    products?:[]
}

export interface IProduct{
    id?:string;
    name:string;
    user_id:string;
    url:string;
    photos?:[];
    description?:string;
    start_price:number;
    desired_price:number;
    prices:[];
    trackable:boolean;
    created_at?:Date;
    updated_at?:Date;
}
