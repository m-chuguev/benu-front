/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Параметры построения графа для фронтенда
 */
export type GraphQueryDto = {
    /**
     * Стартовые узлы (IRI или QName), от которых строится граф
     */
    seedIris?: Array<string>;
    /**
     * Глубина обхода (BFS по объектным свойствам + таксономия)
     */
    depth?: number;
    /**
     * Максимальное количество возвращаемых узлов
     */
    maxNodes?: number;
    /**
     * Включать ли связи наследования (subClassOf)
     */
    includeSubclass?: boolean;
    /**
     * Включать ли связи rdf:type
     */
    includeTypes?: boolean;
    /**
     * Включать ли эквивалентные классы (owl:equivalentClass)
     */
    includeEquivalents?: boolean;
    /**
     * Включать ли дизъюнктные классы (owl:disjointWith)
     */
    includeDisjoints?: boolean;
    /**
     * Фильтрация по namespace/qname префиксам
     */
    includeNamespaces?: Array<string>;
    /**
     * Включать ли data properties (атрибуты узлов)
     */
    includeDataProps?: boolean;
    /**
     * Лимит количества значений для одного data property
     */
    dataValuesLimit?: number;
};

