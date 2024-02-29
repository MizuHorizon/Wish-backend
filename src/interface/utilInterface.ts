export interface IUser {
    id? : string;
    name : string;
    email : string;
    password : string;
    email_token :string | null;
    is_verified : boolean;
    username: string;
    profile_pic:string;
    products?:[]
}

export interface IProduct{
    id?:string;
    name:string;
    company:string;
    user_id:string;
    currencySymbol:string;
    url:string;
    tags : [];
    photos?:[];
    description?:string;
    start_price:number;
    desired_price:number;
    prices?:[] | [string];
    trackable:boolean;
    created_at?:Date;
    updated_at?:Date;
}

export interface IScrapredProduct {
    name:string,
    price :string|number,
    photos : string | null|[],
    currencySymbol:string,
    tags:[],
    org:string,
    prices? : [] | [string];
}
