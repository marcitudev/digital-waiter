import { QueryResultRow } from 'pg';
import pool from '../config/db';

export abstract class GenericRepository<T>{
    private table: string;
    private query: string;

    constructor(
        tableName: string
    ){
        this.table = tableName || '';
        this.query =  `SELECT * FROM ${this.table}`;
    }

    protected async getAll(buildObjectFunction: (row: Array<QueryResultRow>) => Array<T> | Promise<Array<T>>): Promise<Array<T>>{
        return new Promise((resolve, reject) => {
            pool.query(this.query, (error, response) => {
                if(error) reject(error);
                else if(response.rows.length > 0) resolve(buildObjectFunction(response.rows));
                else resolve([]);
            });
        });
    }

    protected async getByAttributeEqualTo(attr: unknown, attrValue: unknown, buildObjectFunction: (row: QueryResultRow) => T | Promise<T>): Promise<T | null>{
        return new Promise((resolve, reject) => {
            const query = this.query.concat(` WHERE ${attr} = $1`);

            pool.query(query, [attrValue], (error, response) => {
                if(error) reject(error);
                else if(response.rows.length > 0) resolve(buildObjectFunction(response.rows[0]));
                else resolve(null);
            });
        });
    }

    protected async getByAttributeLikeAndIgnoreCase(attr: unknown, attrValue: unknown, buildObjectFunction: (row: QueryResultRow) => T | Promise<T>): Promise<T | null>{
        return new Promise((resolve, reject) => {
            const query = `${this.query} WHERE LOWER(${attr}) LIKE CONCAT('%', $1, '%')`;

            pool.query(query, [attrValue], (error, response) => {
                if(error) reject(error);
                else if(response.rows.length > 0) resolve(buildObjectFunction(response.rows[0]));
                else resolve(null);
            });
        });
    }

    protected async existsByAttributeEqualTo(attr: unknown, attrValue: unknown): Promise<boolean>{
        return new Promise((resolve, reject) => {
            const query = `SELECT 1 FROM ${this.table} WHERE ${attr} = $1`;

            pool.query(query, [attrValue], (error, response) => {
                if(error) reject(error);
                resolve(response.rowCount! > 0);
            });
        });
    }

    protected async existsByAttributesEqualTo(attrMap: Map<unknown, unknown>): Promise<boolean>{
        return new Promise((resolve, reject) => {
            let query = `SELECT 1 FROM ${this.table} WHERE `;

            let paramIndex = 1;
            for(const [attr] of attrMap){
                if(paramIndex > 1) 
                    query = query.concat(' AND ');
                query = query.concat(` ${attr} = $${paramIndex}`);
                paramIndex++;
            }

            pool.query(query, [...attrMap.values()], (error, response) => {
                if(error) reject(error);
                resolve(response.rowCount! > 0);
            });
        });
    }

    protected async existsByAttributeLikeAndIgnoreCase(attr: unknown, attrValue: unknown): Promise<boolean>{
        return new Promise((resolve, reject) => {
            const query = `SELECT 1 FROM ${this.table} WHERE LOWER(${attr}) LIKE CONCAT('%', $1, '%')`;

            pool.query(query, [attrValue], (error, response) => {
                if(error) reject(error);
                resolve(response.rows[0] === 1);
            });
        });
    }

}