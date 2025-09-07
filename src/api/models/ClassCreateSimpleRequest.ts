/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ClassCreateSimpleRequest = {
    /**
     * Локальное имя класса в T-Box (будет склеено с namespace T-Box).
     */
    className?: string;
    /**
     * Локальное имя родительского класса (опционально).
     */
    superClassName?: string;
    /**
     * Необязательная метка rdfs:label.
     */
    label?: string;
    /**
     * Необязательный комментарий rdfs:comment.
     */
    comment?: string;
};

