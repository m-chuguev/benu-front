/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Msg } from '../models/Msg';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class OntologyImportApiService {
    /**
     * Импорт T-Box из тела запроса (raw body)
     * Альтернатива multipart: содержимое T-Box-файла отправляется прямо в body.
     * Обязательно укажите корректный Content-Type (например, text/turtle).
     *
     * Граф выбирается автоматически по tboxKey:
     * https://ontology.example.com/{tboxKey}/graphs/tbox
     *
     * @param repository
     * @param tboxKey
     * @param contentType MIME-тип (из заголовка)
     * @param requestBody Данные RDF в теле запроса
     * @param baseUri Base URI для относительных IRI
     * @param replace Очистить граф перед импортом
     * @returns Msg Импорт выполнен
     * @throws ApiError
     */
    public static importTboxRaw(
        repository: string,
        tboxKey: string,
        contentType: string,
        requestBody: Array<string>,
        baseUri?: string,
        replace: boolean = false,
    ): CancelablePromise<Msg> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/ontology-access-service/api/ontology/repositories/{repository}/tboxes/{tboxKey}/import/raw',
            path: {
                'repository': repository,
                'tboxKey': tboxKey,
            },
            headers: {
                'Content-Type': contentType,
            },
            query: {
                'baseUri': baseUri,
                'replace': replace,
            },
            body: requestBody,
            mediaType: 'text/turtle',
        });
    }
    /**
     * Импорт T-Box-файла (multipart/form-data)
     * Загружает файл T-Box для заданного tboxKey в именованный граф:
     * https://ontology.example.com/{tboxKey}/graphs/tbox
     *
     * Параметры:
     * • repository — идентификатор репозитория GraphDB (физическое хранилище).
     * • tboxKey    — ключ T-Box (например, "sales").
     * • baseUri    — базовый адрес для относительных IRI (если в файле есть относительные).
     * • replace    — если true, перед загрузкой очищаем целевой граф.
     *
     * Пример (curl):
     * curl -X POST "http://localhost:8047/api/ontology/repositories/sales-graph/tboxes/sales/import/file?replace=true" \
     * -F "file=@sales-ontology.ttl;type=text/turtle"
     *
     * @param repository Идентификатор репозитория GraphDB
     * @param tboxKey Ключ T-Box
     * @param baseUri Base URI для относительных IRI
     * @param replace Очистить граф перед импортом
     * @param formData
     * @returns Msg Импорт выполнен
     * @throws ApiError
     */
    public static importTboxFile(
        repository: string,
        tboxKey: string,
        baseUri?: string,
        replace: boolean = false,
        formData?: {
            /**
             * Файл RDF (TTL/RDF/XML/JSON-LD/NT/TRIG/N-Quads)
             */
            file: Blob;
        },
    ): CancelablePromise<Msg> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/ontology-access-service/api/ontology/repositories/{repository}/tboxes/{tboxKey}/import/file',
            path: {
                'repository': repository,
                'tboxKey': tboxKey,
            },
            query: {
                'baseUri': baseUri,
                'replace': replace,
            },
            formData: formData,
            mediaType: 'multipart/form-data',
            errors: {
                400: `Пустой файл или неверные параметры`,
            },
        });
    }
    /**
     * Импорт A-Box клиента из тела запроса (raw body)
     * Альтернатива multipart: содержимое файла отправляется прямо в body.
     * Граф вычисляется по (tboxKey, client):
     * https://graph.example.com/{tboxKey}/clients/{client}/graphs/abox
     *
     * @param repository
     * @param tboxKey
     * @param client
     * @param contentType
     * @param requestBody
     * @param baseUri
     * @param replace
     * @returns Msg Импорт выполнен
     * @throws ApiError
     */
    public static importAboxRaw(
        repository: string,
        tboxKey: string,
        client: string,
        contentType: string,
        requestBody: Array<string>,
        baseUri?: string,
        replace: boolean = false,
    ): CancelablePromise<Msg> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/ontology-access-service/api/ontology/repositories/{repository}/tboxes/{tboxKey}/clients/{client}/import/raw',
            path: {
                'repository': repository,
                'tboxKey': tboxKey,
                'client': client,
            },
            headers: {
                'Content-Type': contentType,
            },
            query: {
                'baseUri': baseUri,
                'replace': replace,
            },
            body: requestBody,
            mediaType: 'text/turtle',
        });
    }
    /**
     * Импорт A-Box-файла клиента (multipart/form-data)
     * Загружает A-Box клиента в граф, который определяется (tboxKey, client):
     * https://graph.example.com/{tboxKey}/clients/{client}/graphs/abox
     *
     * Параметры:
     * • repository — репозиторий GraphDB.
     * • tboxKey    — к какому T-Box относится этот A-Box (например, "sales").
     * • client     — клиент/арендатор (например, "acme").
     * • baseUri    — нужен только при относительных IRI.
     * • replace    — при true очищаем A-Box граф клиента перед импортом.
     *
     * @param repository
     * @param tboxKey
     * @param client
     * @param baseUri
     * @param replace
     * @param formData
     * @returns Msg Импорт выполнен
     * @throws ApiError
     */
    public static importAboxFile(
        repository: string,
        tboxKey: string,
        client: string,
        baseUri?: string,
        replace: boolean = false,
        formData?: {
            file: Blob;
        },
    ): CancelablePromise<Msg> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/ontology-access-service/api/ontology/repositories/{repository}/tboxes/{tboxKey}/clients/{client}/import/file',
            path: {
                'repository': repository,
                'tboxKey': tboxKey,
                'client': client,
            },
            query: {
                'baseUri': baseUri,
                'replace': replace,
            },
            formData: formData,
            mediaType: 'multipart/form-data',
        });
    }
    /**
     * @deprecated
     * UNI: Импорт RDF из raw-body с ручным context (устаревающий путь)
     * @param repository
     * @param contentType
     * @param requestBody
     * @param baseUri
     * @param context
     * @param replace
     * @returns any OK
     * @throws ApiError
     */
    public static importOntologyRawLegacy(
        repository: string,
        contentType: string,
        requestBody: Array<string>,
        baseUri?: string,
        context?: string,
        replace: boolean = false,
    ): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/ontology-access-service/api/ontology/repositories/{repository}/import/raw',
            path: {
                'repository': repository,
            },
            headers: {
                'Content-Type': contentType,
            },
            query: {
                'baseUri': baseUri,
                'context': context,
                'replace': replace,
            },
            body: requestBody,
            mediaType: 'text/turtle',
        });
    }
    /**
     * @deprecated
     * UNI: Импорт RDF-файла с ручным указанием context (устаревающий путь)
     * Ручной режим: вы сами передаёте IRI именованного графа в query-параметре context.
     * Рекомендуется использовать новые эндпоинты с tboxKey(+client), чтобы не ошибаться с именованием графов.
     *
     * @param repository
     * @param baseUri
     * @param context
     * @param replace
     * @param formData
     * @returns any OK
     * @throws ApiError
     */
    public static importOntologyMultipart(
        repository: string,
        baseUri?: string,
        context?: string,
        replace: boolean = false,
        formData?: {
            file: Blob;
        },
    ): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/ontology-access-service/api/ontology/repositories/{repository}/import/file',
            path: {
                'repository': repository,
            },
            query: {
                'baseUri': baseUri,
                'context': context,
                'replace': replace,
            },
            formData: formData,
            mediaType: 'multipart/form-data',
        });
    }
}
