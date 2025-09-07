/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateRepositoryResultDto } from '../models/CreateRepositoryResultDto';
import type { DeleteRepositoryResultDto } from '../models/DeleteRepositoryResultDto';
import type { RepositoryConfigDto } from '../models/RepositoryConfigDto';
import type { RepositoryCreateRequestDto } from '../models/RepositoryCreateRequestDto';
import type { RepositoryStatusDto } from '../models/RepositoryStatusDto';
import type { RepositorySummaryDto } from '../models/RepositorySummaryDto';
import type { TboxGraph } from '../models/TboxGraph';
import type { UpdateRepositoryResultDto } from '../models/UpdateRepositoryResultDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class GraphDbRepositoriesService {
    /**
     * Получить конфигурацию репозитория
     * Возвращает подробную конфигурацию конкретного репозитория (тип, правила вывода, параметры индексов и т.д.).
     *
     * Пример:
     * curl -X GET "{base}/api/repositories/dev-repository"
     *
     * @param repository Идентификатор репозитория GraphDB (как в /repositories/{repository})
     * @returns RepositoryConfigDto Конфигурация найдена
     * @throws ApiError
     */
    public static getConfig(
        repository: string,
    ): CancelablePromise<RepositoryConfigDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/ontology-access-service/api/repositories/{repository}',
            path: {
                'repository': repository,
            },
            errors: {
                404: `Репозиторий не найден`,
            },
        });
    }
    /**
     * Обновить конфигурацию существующего репозитория
     * Обновляет конфигурацию репозитория. Полезно, если нужно сменить набор правил, включить/выключить индексы,
     * настроить каталог хранения, заранее загрузить импорты и т.п.
     *
     * Передавайте только те поля, которые хотите изменить. Идентификатор репозитория берётся из пути.
     *
     * Пример DTO (минимальный):
     * {
         * "label": "My Graph (updated)"
         * }
         *
         * Пример DTO (расширенный — поля зависят от вашей модели):
         * {
             * "label": "My Graph (updated)",
             * "sailType": "owlim:Sail",
             * "ruleset": "rdfsplus-optimized",
             * "enableContextIndex": true,
             * "storageFolder": "/var/graphdb/data/my-graph",
             * "extraParams": {
                 * "query-timeout-millis": "30000"
                 * }
                 * }
                 *
                 * Пример:
                 * curl -X PUT "{base}/api/repositories/my-graph" \
                 * -H "Content-Type: application/json" \
                 * -d '{ "label": "My Graph (updated)" }'
                 *
                 * @param repository Идентификатор репозитория
                 * @param requestBody Поля конфигурации, которые нужно обновить
                 * @returns UpdateRepositoryResultDto Конфигурация обновлена
                 * @throws ApiError
                 */
                public static updateRepository(
                    repository: string,
                    requestBody: RepositoryCreateRequestDto,
                ): CancelablePromise<UpdateRepositoryResultDto> {
                    return __request(OpenAPI, {
                        method: 'PUT',
                        url: '/ontology-access-service/api/repositories/{repository}',
                        path: {
                            'repository': repository,
                        },
                        body: requestBody,
                        mediaType: 'application/json',
                        errors: {
                            404: `Репозиторий не найден`,
                        },
                    });
                }
                /**
                 * Удалить репозиторий
                 * Полностью удаляет репозиторий (конфигурацию и данные). Действие необратимо.
                 *
                 * Пример:
                 * curl -X DELETE "{base}/api/repositories/my-graph"
                 *
                 * @param repository Идентификатор репозитория
                 * @returns DeleteRepositoryResultDto Репозиторий удалён
                 * @throws ApiError
                 */
                public static deleteRepository(
                    repository: string,
                ): CancelablePromise<DeleteRepositoryResultDto> {
                    return __request(OpenAPI, {
                        method: 'DELETE',
                        url: '/ontology-access-service/api/repositories/{repository}',
                        path: {
                            'repository': repository,
                        },
                        errors: {
                            404: `Репозиторий не найден`,
                        },
                    });
                }
                /**
                 * Получить список репозиториев
                 * Возвращает список всех репозиториев на текущем GraphDB-сервере.
                 * Полезно для навигации и проверки, что нужный репозиторий уже существует.
                 *
                 * Пример:
                 * curl -X GET "{base}/api/repositories"
                 *
                 * @returns RepositorySummaryDto Список получен
                 * @throws ApiError
                 */
                public static listRepositories(): CancelablePromise<RepositorySummaryDto> {
                    return __request(OpenAPI, {
                        method: 'GET',
                        url: '/ontology-access-service/api/repositories',
                    });
                }
                /**
                 * Создать новый репозиторий (с дефолтными настройками)
                 * Быстрое создание репозитория с безопасными значениями по умолчанию:
                 * • профиль: FREE,
                 * • правила вывода: rdfsplus-optimized,
                 * • прочие параметры — дефолты сервиса.
                 *
                 * Вы можете сразу начать импортировать T-Box/A-Box в созданный репозиторий.
                 *
                 * Примеры:
                 * • Минимум:
                 * curl -X POST "{base}/api/repositories?repository=my-graph"
                 * • С подписью:
                 * curl -X POST "{base}/api/repositories?repository=my-graph&label=My%20Graph"
                 *
                 * @param repository Идентификатор нового репозитория (латиница/цифры/дефисы, без пробелов)
                 * @param label Человеко-читаемое название (опционально)
                 * @returns CreateRepositoryResultDto Репозиторий создан
                 * @throws ApiError
                 */
                public static createRepository(
                    repository: string,
                    label?: string,
                ): CancelablePromise<CreateRepositoryResultDto> {
                    return __request(OpenAPI, {
                        method: 'POST',
                        url: '/ontology-access-service/api/repositories',
                        query: {
                            'repository': repository,
                            'label': label,
                        },
                        errors: {
                            409: `Репозиторий уже существует`,
                        },
                    });
                }
                /**
                 * Очистить все данные из репозитория
                 * Удаляет все триплеты в репозитории, но не трогает конфигурацию (репозиторий остаётся на месте).
                 * Удобно для «сброса данных» перед повторной загрузкой.
                 *
                 * Пример:
                 * curl -X POST "{base}/api/repositories/my-graph/clear"
                 *
                 * @param repository Идентификатор репозитория
                 * @returns any Данные очищены
                 * @throws ApiError
                 */
                public static clearRepository(
                    repository: string,
                ): CancelablePromise<any> {
                    return __request(OpenAPI, {
                        method: 'POST',
                        url: '/ontology-access-service/api/repositories/{repository}/clear',
                        path: {
                            'repository': repository,
                        },
                    });
                }
                /**
                 * Получить все T-Box графы в репозитории
                 * Возвращает список всех T-Box «папок» (именованных графов) в указанном репозитории.
                 *
                 * Что считается T-Box:
                 * • Именованный граф, чей IRI оканчивается на "/graphs/tbox" и внутри которого есть схемные триплеты
                 * (owl:Class/rdfs:Class/…).
                 *
                 * Что возвращаем:
                 * • tboxKey  — ключ T-Box (последний сегмент перед "/graphs/tbox"), например "sales".
                 * • graphIri — полный IRI графа, например "https://ontology.example.com/sales/graphs/tbox".
                 *
                 * Пример:
                 * [
                     * { "tboxKey": "sales", "graphIri": "https://ontology.example.com/sales/graphs/tbox" },
                     * { "tboxKey": "education", "graphIri": "https://ontology.example.com/education/graphs/tbox" }
                     * ]
                     *
                     * @param repository Идентификатор репозитория GraphDB
                     * @returns TboxGraph Список T-Box графов получен
                     * @throws ApiError
                     */
                    public static listTboxes(
                        repository: string,
                    ): CancelablePromise<TboxGraph> {
                        return __request(OpenAPI, {
                            method: 'GET',
                            url: '/ontology-access-service/api/repositories/{repository}/tboxes',
                            path: {
                                'repository': repository,
                            },
                        });
                    }
                    /**
                     * Получить статус репозитория (агрегированный)
                     * Возвращает агрегированную информацию о состоянии репозитория (если поддерживается вашей версией GraphDB):
                     * индексация, прогресс операций и т.д.
                     *
                     * Пример:
                     * curl -X GET "{base}/api/repositories/my-graph/status"
                     *
                     * @param repository Идентификатор репозитория
                     * @returns RepositoryStatusDto Статус получен
                     * @throws ApiError
                     */
                    public static getStatus(
                        repository: string,
                    ): CancelablePromise<RepositoryStatusDto> {
                        return __request(OpenAPI, {
                            method: 'GET',
                            url: '/ontology-access-service/api/repositories/{repository}/status',
                            path: {
                                'repository': repository,
                            },
                            errors: {
                                404: `Репозиторий не найден`,
                            },
                        });
                    }
                    /**
                     * Получить количество триплетов в репозитории
                     * Возвращает общее число триплетов во всех графах репозитория.
                     * Полезно для быстрой оценки объёма данных.
                     *
                     * Пример:
                     * curl -X GET "{base}/api/repositories/my-graph/size"
                     *
                     * @param repository Идентификатор репозитория
                     * @returns number Количество триплетов
                     * @throws ApiError
                     */
                    public static getSize(
                        repository: string,
                    ): CancelablePromise<number> {
                        return __request(OpenAPI, {
                            method: 'GET',
                            url: '/ontology-access-service/api/repositories/{repository}/size',
                            path: {
                                'repository': repository,
                            },
                            errors: {
                                404: `Репозиторий не найден`,
                            },
                        });
                    }
                    /**
                     * Проверить, существует ли репозиторий
                     * Быстрая проверка наличия репозитория (true/false).
                     * Под капотом вызывается HEAD/GET в GraphDB.
                     *
                     * Пример:
                     * curl -X GET "{base}/api/repositories/my-graph/exists"
                     *
                     * @param repository Идентификатор репозитория
                     * @returns boolean true/false
                     * @throws ApiError
                     */
                    public static exists(
                        repository: string,
                    ): CancelablePromise<boolean> {
                        return __request(OpenAPI, {
                            method: 'GET',
                            url: '/ontology-access-service/api/repositories/{repository}/exists',
                            path: {
                                'repository': repository,
                            },
                        });
                    }
                }
