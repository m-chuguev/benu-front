/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CardinalityDto } from './CardinalityDto';
/**
 * Ребро графа (объектное свойство, наследование, типизация и т.п.)
 */
export type EdgeDto = {
    /**
     * Стабильный ID ребра (например, hash(from+predicate+to))
     */
    id?: string;
    /**
     * ID узла-источника (NodeDto.id)
     */
    from?: string;
    /**
     * ID узла-цели (NodeDto.id)
     */
    to?: string;
    /**
     * Тип ребра: объектное свойство, наследование, типизация и пр.
     */
    kind?: 'OBJECT_PROPERTY' | 'SUBCLASS_OF' | 'RDF_TYPE' | 'EQUIVALENT' | 'SAME_AS' | 'DISJOINT_WITH';
    /**
     * Полный IRI свойства/аксиомы
     */
    iri?: string;
    /**
     * QName свойства (префикс:local)
     */
    qname?: string;
    /**
     * Отображаемое имя ребра
     */
    label?: string;
    /**
     * Признак направленности ребра (true = ориентированное)
     */
    directed?: boolean;
    cardinality?: CardinalityDto;
    /**
     * QName обратного свойства, если есть
     */
    inverseOf?: string | null;
    /**
     * Дополнительные визуальные подсказки для фронта
     */
    attrs?: Record<string, Record<string, any>>;
};

