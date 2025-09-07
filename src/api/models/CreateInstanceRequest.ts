/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CreateInstanceRequest = {
    /**
     * IRI класса
     */
    classIri: string;
    /**
     * IRI экземпляра (если хотите задать явно)
     */
    instanceIri?: string;
    /**
     * Локальный ID для генерации IRI
     */
    localId?: string;
    /**
     * Человекочитаемая метка (rdfs:label)
     */
    label?: string;
};

