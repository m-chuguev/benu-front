/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Информация о пагинации/догрузке, если граф возвращён не полностью
 */
export type PageDto = {
    complete?: boolean;
    cursor?: string;
    returnedNodes?: number;
    returnedEdges?: number;
};

