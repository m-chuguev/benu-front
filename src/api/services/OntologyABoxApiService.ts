/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateInstanceRequest } from '../models/CreateInstanceRequest';
import type { GraphDBResponse } from '../models/GraphDBResponse';
import type { TripleRequest } from '../models/TripleRequest';
import type { TripleRequestList } from '../models/TripleRequestList';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class OntologyABoxApiService {
    /**
     * Добавить список триплетов (A-Box) с привязкой к T-Box и клиенту
     * Вставляет **несколько фактов** в A-Box «папку», определяемую (T-Box, клиент).
     *
     * • Именованный граф A-Box: https://graph.example.com/{tboxKey}/clients/{client}/graphs/abox
     * • Все IRI в списке — абсолютные.
     * • Если у элемента есть 'annotation' — добавляется rdfs:comment к его subject.
     *
     * @param tboxKey Ключ/имя T-Box
     * @param client Имя клиента/арендатора
     * @param repository Идентификатор репозитория GraphDB
     * @param requestBody Список триплетов (все IRI — абсолютные).
     * @returns string Триплеты записаны
     * @throws ApiError
     */
    public static addTripleListInAbox(
        tboxKey: string,
        client: string,
        repository: string,
        requestBody: TripleRequestList,
    ): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/ontology-access-service/api/ontology/tboxes/{tboxKey}/clients/{client}/repositories/{repository}/triples_list',
            path: {
                'tboxKey': tboxKey,
                'client': client,
                'repository': repository,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Пустой/некорректный список`,
                500: `Ошибка GraphDB/репозитория`,
            },
        });
    }
    /**
     * Добавить один триплет (A-Box) с привязкой к T-Box и клиенту
     * Кладёт **один факт** в A-Box «папку», которая определяется парой (T-Box, клиент).
     *
     * Как формируется IRI папки (именованного графа) A-Box:
     * • https://graph.example.com/{tboxKey}/clients/{client}/graphs/abox
     * Примеры:
     * sales + acme    → https://graph.example.com/sales/clients/acme/graphs/abox
     * inventory + foo → https://graph.example.com/inventory/clients/foo/graphs/abox
     *
     * Параметры пути:
     * • tboxKey — ключ/имя T-Box (напр. "sales")
     * • client  — клиент/арендатор (напр. "acme")
     * • repository — идентификатор репозитория GraphDB
     *
     * Тело:
     * • subject, predicate, object — абсолютные IRI (в простейшем варианте object — тоже IRI).
     * • annotation (опционально) — положим как rdfs:comment к subject.
     *
     * @param tboxKey Ключ/имя T-Box
     * @param client Имя клиента/арендатора
     * @param repository Идентификатор репозитория GraphDB
     * @param requestBody Один триплет (все IRI — абсолютные).
     * @returns string Триплет записан
     * @throws ApiError
     */
    public static addTripleInAbox(
        tboxKey: string,
        client: string,
        repository: string,
        requestBody: TripleRequest,
    ): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/ontology-access-service/api/ontology/tboxes/{tboxKey}/clients/{client}/repositories/{repository}/triples',
            path: {
                'tboxKey': tboxKey,
                'client': client,
                'repository': repository,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Неверные параметры`,
                500: `Ошибка GraphDB/репозитория`,
            },
        });
    }
    /**
     * Создать экземпляр класса в A-Box (в графе клиента для указанного T-Box)
     * Создаёт ресурс заданного класса **и автоматически** добавляет типизацию `rdf:type`.
     * Дополнительно можно задать `rdfs:label`.
     *
     * Куда кладём данные:
     * • В именованный граф A-Box, который строится из (tboxKey, client):
     * https://graph.example.com/{tboxKey}/clients/{client}/graphs/abox
     *
     * Как выбирается IRI экземпляра:
     * • Если `instanceIri` указан — используется он (должен быть абсолютным IRI).
     * • Иначе IRI генерируется по шаблону:
     * {instanceBase}/{tboxKey}/clients/{client}/id/{ClassFragment}/{localId|uuid}
     * где {ClassFragment} — хвост класса (например, из https://...#Order берём `Order`).
     * `instanceBase` настраивается свойством `graphdb.instance-base`.
     *
     * Полезно для типичных сценариев:
     * • Создать заказ, аккаунт, продукт и т.п. без ручной сборки SPARQL/Turtle.
     * • Немедленно добавить человеку читаемую метку (`rdfs:label`).
     *
     * Возвращает фактический IRI созданного экземпляра.
     *
     * @param tboxKey Ключ/имя T-Box
     * @param client Клиент/арендатор
     * @param repository Репозиторий GraphDB
     * @param requestBody Параметры создания экземпляра:
     * • classIri — ОБЯЗАТЕЛЬНО, абсолютный IRI класса (напр., https://ontology.example.com/sales#Order).
     * • instanceIri — опционально, абсолютный IRI экземпляра. Если не задан, он будет сгенерирован.
     * • localId — опционально, локальный идентификатор для генерации IRI (например, "O-90001").
     * Если и instanceIri, и localId не заданы — будет сгенерирован UUID.
     * • label — опционально, человеко-читаемая метка (rdfs:label).
     *
     * @returns string Экземпляр создан
     * @throws ApiError
     */
    public static createInstanceOfClass(
        tboxKey: string,
        client: string,
        repository: string,
        requestBody: CreateInstanceRequest,
    ): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/ontology-access-service/api/ontology/tboxes/{tboxKey}/clients/{client}/repositories/{repository}/instances/of-class',
            path: {
                'tboxKey': tboxKey,
                'client': client,
                'repository': repository,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Неверные параметры`,
                500: `Ошибка GraphDB/репозитория`,
            },
        });
    }
    /**
     * Поиск по меткам (rdfs:label) внутри A-Box графа
     * Ищет ресурсы по подстроке в rdfs:label, **только** в A-Box графе клиента.
     * Возвращает ?s ?label. Регистр игнорируется.
     *
     * @param tboxKey
     * @param client
     * @param repository
     * @param q Поисковая подстрока
     * @param limit LIMIT
     * @param offset OFFSET
     * @returns GraphDBResponse OK
     * @throws ApiError
     */
    public static searchByLabel(
        tboxKey: string,
        client: string,
        repository: string,
        q: string,
        limit?: number,
        offset?: number,
    ): CancelablePromise<GraphDBResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/ontology-access-service/api/ontology/tboxes/{tboxKey}/clients/{client}/repositories/{repository}/search/label',
            path: {
                'tboxKey': tboxKey,
                'client': client,
                'repository': repository,
            },
            query: {
                'q': q,
                'limit': limit,
                'offset': offset,
            },
        });
    }
    /**
     * Типы (rdf:type) ресурса из A-Box графа
     * Возвращает классы ресурса (?type) с учётом параметра inferred, только из A-Box графа клиента.
     * @param tboxKey
     * @param client
     * @param repository
     * @param iri IRI ресурса
     * @param inferred Инференция
     * @returns GraphDBResponse OK
     * @throws ApiError
     */
    public static getTypesOfResource(
        tboxKey: string,
        client: string,
        repository: string,
        iri: string,
        inferred: boolean = true,
    ): CancelablePromise<GraphDBResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/ontology-access-service/api/ontology/tboxes/{tboxKey}/clients/{client}/repositories/{repository}/resource/types',
            path: {
                'tboxKey': tboxKey,
                'client': client,
                'repository': repository,
            },
            query: {
                'iri': iri,
                'inferred': inferred,
            },
        });
    }
    /**
     * Исходящие рёбра (predicate/object) из ресурса
     * Возвращает факты вида: <resource> ?p ?o в A-Box графе.
     * Переменные: ?p ?o ?oLabel ?isLiteral ?datatype ?lang.
     * Можно сузить по конкретному свойству (predicateIri).
     *
     * @param tboxKey
     * @param client
     * @param repository
     * @param iri IRI ресурса
     * @param predicateIri Фильтр по свойству
     * @param inferred Инференция
     * @param limit LIMIT
     * @param offset OFFSET
     * @returns GraphDBResponse OK
     * @throws ApiError
     */
    public static getOutgoingEdges(
        tboxKey: string,
        client: string,
        repository: string,
        iri: string,
        predicateIri?: string,
        inferred: boolean = true,
        limit?: number,
        offset?: number,
    ): CancelablePromise<GraphDBResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/ontology-access-service/api/ontology/tboxes/{tboxKey}/clients/{client}/repositories/{repository}/resource/outgoing',
            path: {
                'tboxKey': tboxKey,
                'client': client,
                'repository': repository,
            },
            query: {
                'iri': iri,
                'predicateIri': predicateIri,
                'inferred': inferred,
                'limit': limit,
                'offset': offset,
            },
        });
    }
    /**
     * Метки ресурса (rdfs:label) в A-Box графе
     * Возвращает все rdfs:label ресурса (?label) из A-Box графа клиента.
     * @param tboxKey
     * @param client
     * @param repository
     * @param iri IRI ресурса
     * @returns GraphDBResponse OK
     * @throws ApiError
     */
    public static getLabelsOfResource(
        tboxKey: string,
        client: string,
        repository: string,
        iri: string,
    ): CancelablePromise<GraphDBResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/ontology-access-service/api/ontology/tboxes/{tboxKey}/clients/{client}/repositories/{repository}/resource/labels',
            path: {
                'tboxKey': tboxKey,
                'client': client,
                'repository': repository,
            },
            query: {
                'iri': iri,
            },
        });
    }
    /**
     * Входящие рёбра (subject/predicate) к ресурсу
     * Возвращает факты вида: ?s ?p <resource> в A-Box графе.
     * Переменные: ?s ?p ?sLabel.
     * Можно сузить по конкретному свойству (predicateIri).
     *
     * @param tboxKey
     * @param client
     * @param repository
     * @param iri IRI ресурса
     * @param predicateIri Фильтр по свойству
     * @param inferred Инференция
     * @param limit LIMIT
     * @param offset OFFSET
     * @returns GraphDBResponse OK
     * @throws ApiError
     */
    public static getIncomingEdges(
        tboxKey: string,
        client: string,
        repository: string,
        iri: string,
        predicateIri?: string,
        inferred: boolean = true,
        limit?: number,
        offset?: number,
    ): CancelablePromise<GraphDBResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/ontology-access-service/api/ontology/tboxes/{tboxKey}/clients/{client}/repositories/{repository}/resource/incoming',
            path: {
                'tboxKey': tboxKey,
                'client': client,
                'repository': repository,
            },
            query: {
                'iri': iri,
                'predicateIri': predicateIri,
                'inferred': inferred,
                'limit': limit,
                'offset': offset,
            },
        });
    }
    /**
     * Экземпляры класса в A-Box графе клиента
     * Возвращает IRI всех ресурсов типа указанного класса, но **только** из A-Box графа клиента:
     * https://graph.example.com/{tboxKey}/clients/{client}/graphs/abox
     * Переменная результата: ?s.
     *
     * @param tboxKey
     * @param client
     * @param repository
     * @param classIri IRI класса
     * @param inferred Использовать инференцию GraphDB
     * @param limit LIMIT
     * @param offset OFFSET
     * @returns GraphDBResponse OK
     * @throws ApiError
     */
    public static listInstancesOfClass(
        tboxKey: string,
        client: string,
        repository: string,
        classIri: string,
        inferred: boolean = true,
        limit?: number,
        offset?: number,
    ): CancelablePromise<GraphDBResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/ontology-access-service/api/ontology/tboxes/{tboxKey}/clients/{client}/repositories/{repository}/instances',
            path: {
                'tboxKey': tboxKey,
                'client': client,
                'repository': repository,
            },
            query: {
                'classIri': classIri,
                'inferred': inferred,
                'limit': limit,
                'offset': offset,
            },
        });
    }
    /**
     * Посчитать количество триплетов в A-Box графе
     * Считает все триплеты **только** в графе клиента, связанном с указанным T-Box.
     * Граф строится автоматически как:
     * https://graph.example.com/{tboxKey}/clients/{client}/graphs/abox
     * Возвращает SELECT с переменной ?count.
     *
     * @param tboxKey Ключ/имя T-Box
     * @param client Имя клиента
     * @param repository Репозиторий GraphDB
     * @returns GraphDBResponse Успешно
     * @throws ApiError
     */
    public static countAboxGraph(
        tboxKey: string,
        client: string,
        repository: string,
    ): CancelablePromise<GraphDBResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/ontology-access-service/api/ontology/tboxes/{tboxKey}/clients/{client}/repositories/{repository}/graph/count',
            path: {
                'tboxKey': tboxKey,
                'client': client,
                'repository': repository,
            },
        });
    }
}
