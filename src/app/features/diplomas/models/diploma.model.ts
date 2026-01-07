export interface Diploma {
    _id: string;
    title: string;
    img: string;
}

export interface Subject {
    _id: string;
    name: string;
    icon: string;
}

export interface SubjectsResponse {
    message: string;
    metadata: any;
    subjects: Subject[];
}
