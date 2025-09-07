/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Узел графа (класс, индивид, dataType или literal)
 */
export type NodeDto = {
    /**
     * Стабильный ID для фронта (обычно hash от IRI или UUID)
     */
    id?: string;
    /**
     * Полный IRI сущности, если есть
     */
    iri?: string;
    /**
     * QName сущности (префикс:local)
     */
    qname?: string;
    /**
     * Отображаемое имя узла
     */
    label?: string;
    /**
     * Описание или комментарий
     */
    comment?: string;
    /**
     * Тип узла
     */
    kind?: 'CLASS' | 'INDIVIDUAL' | 'BNODE' | 'DATATYPE' | 'LITERAL';
    /**
     * Произвольные теги для классификации/стилей
     */
    tags?: Array<string>;
    /**
     * Дополнительные атрибуты (цвет, иконка, группа и т.п.)
     */
    attrs?: Record<string, Record<string, any>>;
    /**
     * Инлайн data properties (атрибуты узла)
     */
    data?: {
        iri?: string;
        qname?: string;
        label?: string;
        datatype?: string;
        values?: Array<string>;
        truncated?: boolean;
    };
};

