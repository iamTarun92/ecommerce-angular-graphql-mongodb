export interface CategoryRoot {
    _id: string
    name: string
    image: string
}

export interface CategoryQueryResult {
    data: {
        getCategories: CategoryRoot[];
    };
}