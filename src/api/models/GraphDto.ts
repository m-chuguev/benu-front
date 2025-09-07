/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EdgeDto } from './EdgeDto';
import type { GraphMetaDto } from './GraphMetaDto';
import type { NodeDto } from './NodeDto';
import type { PageDto } from './PageDto';
/**
 * Результат построения графа онтологии (узлы, рёбра, метаданные и пагинация)
 */
export type GraphDto = {
    meta?: GraphMetaDto;
    /**
     * Список узлов графа
     */
    nodes: Array<NodeDto>;
    /**
     * Список рёбер графа
     */
    edges: Array<EdgeDto>;
    page?: PageDto;
};

