/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ClassCreateSimpleRequest } from '../models/ClassCreateSimpleRequest';
import type { GraphDBRequest } from '../models/GraphDBRequest';
import type { GraphDBResponse } from '../models/GraphDBResponse';
import type { Msg } from '../models/Msg';
import type { TripleRequest } from '../models/TripleRequest';
import type { TripleRequestList } from '../models/TripleRequestList';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class OntologyTBoxApiService {
    /**
     * Прокси SPARQL в GraphDB
     * Выполняет SPARQL SELECT/DESCRIBE/ASK/CONSTRUCT в указанном репозитории.
     * Удобно для проверки запросов и быстрой диагностики.
     *
     * В теле запроса передаётся JSON: { "query": "..." }.
     *
     * @param repository Идентификатор репозитория GraphDB
     * @param requestBody SPARQL-запрос в JSON
     * @returns GraphDBResponse OK: результаты SPARQL
     * @throws ApiError
     */
    public static graphDbProxy(
        repository: string,
        requestBody: GraphDBRequest,
    ): CancelablePromise<GraphDBResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/ontology-access-service/api/proxy/repositories/{repository}',
            path: {
                'repository': repository,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Некорректный SPARQL`,
                500: `Ошибка GraphDB`,
            },
        });
    }
    /**
     * Создать класс в T-Box по коротким именам
     * Упрощённый вариант: вы указываете **репозиторий** и **tboxKey** в пути, а в теле — только короткие имена.
     *
     * Как формируется адресация:
     * • Namespace T-Box для классов берётся из правил именования: tboxNamespace(tboxKey), например:
     * https://ontology.example.com/{tboxKey}#
     * • Абсолютные IRI строятся так:
     * classIri        = tboxNamespace + className
     * superClassIri   = tboxNamespace + superClassName (если задан)
     * • Запись всегда идёт в граф T-Box:
     * context = tboxGraph(tboxKey) → https://ontology.example.com/{tboxKey}/graphs/tbox
     *
     * Пример вызова:
     * POST /api/ontology/repositories/sales-graph/tboxes/sales/classes
     * {
         * "className": "PriorityOrder",
         * "superClassName": "Order",
         * "label": "Priority order",
         * "comment": "Special handling required"
         * }
         *
         * @param repository GraphDB repository id
         * @param tboxKey Ключ T-Box (например, 'sales')
         * @param requestBody Локальные имена и опциональные метки/комментарии
         * @returns Msg Класс создан/обновлён
         * @throws ApiError
         */
        public static createClassSimple(
            repository: string,
            tboxKey: string,
            requestBody: ClassCreateSimpleRequest,
        ): CancelablePromise<Msg> {
            return __request(OpenAPI, {
                method: 'POST',
                url: '/ontology-access-service/api/ontology/repositories/{repository}/tboxes/{tboxKey}/classes',
                path: {
                    'repository': repository,
                    'tboxKey': tboxKey,
                },
                body: requestBody,
                mediaType: 'application/json',
                errors: {
                    400: `Некорректные параметры`,
                },
            });
        }
        /**
         * Upsert аксиомы объектного свойства (rdfs:domain & rdfs:range)
         * Создаёт/заменяет аксиомы для объектного свойства:
         * • subject  → IRI доменного класса (domain)
         * • predicate → IRI объектного свойства
         * • object  → IRI класса в range
         *
         * Дополнительно: если указан 'annotation', она сохраняется как rdfs:comment у свойства.
         * Классы домена и ранжа будут типизированы как owl:Class, чтобы корректно попадать в TBox-запросы.
         *
         * @param repository Идентификатор репозитория GraphDB
         * @param requestBody JSON-триплет с доменом/свойством/ранжем. Все IRI — абсолютные.
         * @returns Msg Аксиома записана/заменена
         * @throws ApiError
         */
        public static addObjectPropertyAxiom(
            repository: string,
            requestBody: TripleRequest,
        ): CancelablePromise<Msg> {
            return __request(OpenAPI, {
                method: 'POST',
                url: '/ontology-access-service/api/ontology/repositories/{repository}/axioms/object-property',
                path: {
                    'repository': repository,
                },
                body: requestBody,
                mediaType: 'application/json',
                errors: {
                    400: `Некорректные параметры`,
                },
            });
        }
        /**
         * Удалить ВСЕ аксиомы объектного свойства
         * Удаляет тип свойства (owl:ObjectProperty), все rdfs:domain/rdfs:range и все rdfs:comment.
         * @param repository Идентификатор репозитория GraphDB
         * @param propertyIri IRI объектного свойства
         * @returns Msg Удалено всё
         * @throws ApiError
         */
        public static deleteAllPropertyAxioms(
            repository: string,
            propertyIri: string,
        ): CancelablePromise<Msg> {
            return __request(OpenAPI, {
                method: 'DELETE',
                url: '/ontology-access-service/api/ontology/repositories/{repository}/axioms/object-property',
                path: {
                    'repository': repository,
                },
                query: {
                    'propertyIri': propertyIri,
                },
                errors: {
                    400: `Некорректные параметры`,
                },
            });
        }
        /**
         * Массовый upsert аксиом объектных свойств
         * Массив таких же элементов, как в одиночном методе. Удобно загружать несколько аксиом разом.
         * @param repository Идентификатор репозитория GraphDB
         * @param requestBody Список аксиом (domain/property/range). Все IRI — абсолютные.
         * @returns Msg Аксиомы записаны/заменены
         * @throws ApiError
         */
        public static addObjectPropertyAxiomList(
            repository: string,
            requestBody: TripleRequestList,
        ): CancelablePromise<Msg> {
            return __request(OpenAPI, {
                method: 'POST',
                url: '/ontology-access-service/api/ontology/repositories/{repository}/axioms/object-property-list',
                path: {
                    'repository': repository,
                },
                body: requestBody,
                mediaType: 'application/json',
                errors: {
                    400: `Некорректный JSON`,
                },
            });
        }
        /**
         * Top-level классы внутри конкретного T-Box
         * Возвращает IRI классов верхнего уровня **только из указанного T-Box-графа**.
         *
         * Зачем tboxKey:
         * • В одном репозитории может быть несколько T-Box (разные домены). Нам нужен конкретный.
         * • Граф T-Box строится по правилам именования и выглядит как:
         * https://ontology.example.com/{tboxKey}/graphs/tbox
         *
         * Как считаем "верхний уровень":
         * • Класс объявлен как owl:Class/rdfs:Class.
         * • У класса нет именованного суперкласса (кроме owl:Thing) ВНУТРИ ЭТОГО T-Box-графа.
         *
         * Параметр inferred:
         * • Включает/выключает серверную инференцию GraphDB. Обычно оставляйте true.
         * • Учтите, что выводимые связи могут появляться из общего репозитория, но мы всё равно фильтруем результат
         * по T-Box-графу (суперклассы смотрим в этом же графе).
         *
         * @param repository GraphDB repository
         * @param tboxKey Ключ T-Box (имя домена)
         * @param inferred Учитывать инференцию GraphDB
         * @param includeBuiltins Включать служебные owl:Thing/owl:Nothing
         * @returns string OK
         * @throws ApiError
         */
        public static getTopLevelClassesOfTbox(
            repository: string,
            tboxKey: string,
            inferred: boolean = true,
            includeBuiltins: boolean = false,
        ): CancelablePromise<Array<string>> {
            return __request(OpenAPI, {
                method: 'GET',
                url: '/ontology-access-service/api/ontology/repositories/{repository}/tboxes/{tboxKey}/classes/top',
                path: {
                    'repository': repository,
                    'tboxKey': tboxKey,
                },
                query: {
                    'inferred': inferred,
                    'includeBuiltins': includeBuiltins,
                },
            });
        }
        /**
         * Классы из rdfs:range указанного свойства
         * Возвращает IRI классов из rdfs:range объектного свойства.
         * Если range — составной (unionOf/intersectionOf), вернутся входящие классы.
         *
         * @param repository Идентификатор репозитория GraphDB
         * @param propertyIri Абсолютный IRI объектного свойства (URL-кодированный)
         * @param inferred Учитывать инференцию GraphDB
         * @returns string OK: список IRI классов
         * @throws ApiError
         */
        public static getRangeClassesOfProperty(
            repository: string,
            propertyIri: string,
            inferred: boolean = true,
        ): CancelablePromise<string> {
            return __request(OpenAPI, {
                method: 'GET',
                url: '/ontology-access-service/api/ontology/repositories/{repository}/properties/range-classes',
                path: {
                    'repository': repository,
                },
                query: {
                    'propertyIri': propertyIri,
                    'inferred': inferred,
                },
                errors: {
                    400: `Отсутствует propertyIri`,
                },
            });
        }
        /**
         * @deprecated
         * Получить классы верхнего уровня
         * Возвращает IRI классов, у которых нет именованных суперклассов, кроме owl:Thing.
         * Полезно для навигации по TBox.
         *
         * Важно:
         * • Если класс нигде явно не объявлен как owl:Class/rdfs:Class, он не попадёт в выборку.
         * • Параметр inferred=true включает инференцию GraphDB.
         *
         * @param repository Идентификатор репозитория GraphDB
         * @param inferred Учитывать инференцию GraphDB (серверные правила)
         * @param includeBuiltins Включать служебные классы owl:Thing/owl:Nothing
         * @returns string OK: множество IRI классов
         * @throws ApiError
         */
        public static getTopLevelClasses(
            repository: string,
            inferred: boolean = true,
            includeBuiltins: boolean = false,
        ): CancelablePromise<string> {
            return __request(OpenAPI, {
                method: 'GET',
                url: '/ontology-access-service/api/ontology/repositories/{repository}/classes/top',
                path: {
                    'repository': repository,
                },
                query: {
                    'inferred': inferred,
                    'includeBuiltins': includeBuiltins,
                },
                errors: {
                    400: `Некорректные параметры`,
                },
            });
        }
        /**
         * Классы из range свойства, релевантные для заданного subject-класса
         * Возвращает классы из rdfs:range свойства, которые применимы, когда субъект имеет указанный класс.
         * Применимость: у свойства нет domain ИЛИ subject-класс — подтип domain.
         *
         * @param repository Идентификатор репозитория GraphDB
         * @param classIri Абсолютный IRI subject-класса (URL-кодированный)
         * @param propertyIri Абсолютный IRI объектного свойства (URL-кодированный)
         * @param inferred Учитывать инференцию GraphDB
         * @returns string OK: список IRI классов
         * @throws ApiError
         */
        public static getRangeClassesOfPropertyForClass(
            repository: string,
            classIri: string,
            propertyIri: string,
            inferred: boolean = true,
        ): CancelablePromise<string> {
            return __request(OpenAPI, {
                method: 'GET',
                url: '/ontology-access-service/api/ontology/repositories/{repository}/classes/property/range-classes',
                path: {
                    'repository': repository,
                },
                query: {
                    'classIri': classIri,
                    'propertyIri': propertyIri,
                    'inferred': inferred,
                },
                errors: {
                    400: `Отсутствуют classIri/propertyIri`,
                },
            });
        }
        /**
         * Свойства, применимые к классу (по rdfs:domain)
         * Возвращает IRI объектных свойств, чьё rdfs:domain соответствует указанному классу.
         * • directOnly=false — учитывает иерархию (rdfs:subClassOf*).
         * • directOnly=true  — ровно domain = classIri.
         *
         * Подсказка: IRI в query-параметрах должны быть URL-кодированы.
         *
         * @param repository Идентификатор репозитория GraphDB
         * @param classIri Абсолютный IRI класса (URL-кодированный)
         * @param inferred Учитывать инференцию GraphDB
         * @param directOnly Требовать точное совпадение domain (= classIri)
         * @returns string OK: список IRI свойств
         * @throws ApiError
         */
        public static getObjectPropertiesOfClass(
            repository: string,
            classIri: string,
            inferred: boolean = true,
            directOnly: boolean = false,
        ): CancelablePromise<string> {
            return __request(OpenAPI, {
                method: 'GET',
                url: '/ontology-access-service/api/ontology/repositories/{repository}/classes/object-properties',
                path: {
                    'repository': repository,
                },
                query: {
                    'classIri': classIri,
                    'inferred': inferred,
                    'directOnly': directOnly,
                },
                errors: {
                    400: `Отсутствует classIri`,
                },
            });
        }
        /**
         * Удалить конкретную аксиому rdfs:range
         * Удаляет rdfs:range (property → rangeClass), если такая аксиома существует.
         * @param repository Идентификатор репозитория GraphDB
         * @param propertyIri IRI объектного свойства
         * @param rangeIri IRI класса из range
         * @returns Msg Удалено
         * @throws ApiError
         */
        public static deletePropertyRange(
            repository: string,
            propertyIri: string,
            rangeIri: string,
        ): CancelablePromise<Msg> {
            return __request(OpenAPI, {
                method: 'DELETE',
                url: '/ontology-access-service/api/ontology/repositories/{repository}/axioms/object-property/range',
                path: {
                    'repository': repository,
                },
                query: {
                    'propertyIri': propertyIri,
                    'rangeIri': rangeIri,
                },
                errors: {
                    400: `Некорректные параметры`,
                },
            });
        }
        /**
         * Удалить конкретную аксиому rdfs:domain
         * Удаляет rdfs:domain (property → domainClass), если такая аксиома существует.
         * @param repository Идентификатор репозитория GraphDB
         * @param propertyIri IRI объектного свойства
         * @param domainIri IRI доменного класса
         * @returns Msg Удалено
         * @throws ApiError
         */
        public static deletePropertyDomain(
            repository: string,
            propertyIri: string,
            domainIri: string,
        ): CancelablePromise<Msg> {
            return __request(OpenAPI, {
                method: 'DELETE',
                url: '/ontology-access-service/api/ontology/repositories/{repository}/axioms/object-property/domain',
                path: {
                    'repository': repository,
                },
                query: {
                    'propertyIri': propertyIri,
                    'domainIri': domainIri,
                },
                errors: {
                    400: `Некорректные параметры`,
                },
            });
        }
    }
