/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { GraphDto } from '../models/GraphDto';
import type { GraphQueryDto } from '../models/GraphQueryDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class OntologyGraphViewService {
    /**
     * Получить графовое представление онтологии
     * Возвращает визуальное представление TBox-графа в виде узлов и рёбер для отображения на фронте.
     * @param repository Идентификатор репозитория
     * @param tBoxGraphName Имя TBox-графа
     * @param requestBody Параметры построения графа (семена, глубина, лимиты)
     * @returns GraphDto Успешное построение графа
     * @throws ApiError
     */
    public static getGraphViewMap(
        repository: string,
        tBoxGraphName: string,
        requestBody: GraphQueryDto,
    ): CancelablePromise<GraphDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/ontology-access-service/api/ontology/repositories/{repository}/graphs/{tBoxGraphName}/graph-view',
            path: {
                'repository': repository,
                'tBoxGraphName': tBoxGraphName,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Некорректные параметры запроса`,
                500: `Ошибка на стороне сервера`,
            },
        });
    }
}
