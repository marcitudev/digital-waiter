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

    async getByAttributeEqualTo(attr: string, attrValue: string, buildObjectFunction: (row: QueryResultRow) => T | Promise<T>): Promise<T | null>{
        return new Promise((resolve, reject) => {
            const query = this.query.concat(` WHERE ${attr} = ${attrValue}`);

            pool.query(query, (error, response) => {
                if(error) reject(error);
                else if(response.rows.length > 0) resolve(buildObjectFunction(response.rows[0]));
                else resolve(null);
            });
        });
    }

    async getByAttributeLikeAndIgnoreCase(attr: string, attrValue: string, buildObjectFunction: (row: QueryResultRow) => T | Promise<T>): Promise<T | null>{
        return new Promise((resolve, reject) => {
            const query = `${this.query} WHERE LOWER(${attr}) LIKE CONCAT('%', ${attrValue}, '%')`;

            pool.query(query, (error, response) => {
                if(error) reject(error);
                else if(response.rows.length > 0) resolve(buildObjectFunction(response.rows[0]));
                else resolve(null);
            });
        });
    }

    async existsByAttributeEqualTo(attr: string, attrValue: string): Promise<boolean>{
        return new Promise((resolve, reject) => {
            const query = `SELECT 1 FROM ${this.table} WHERE ${attr} = ${attrValue}`;

            pool.query(query, (error, response) => {
                if(error) reject(error);
                resolve(response.rows[0] === 1);
            });
        });
    }

    async existsByAttributeLikeAndIgnoreCase(attr: string, attrValue: string): Promise<boolean>{
        return new Promise((resolve, reject) => {
            const query = `SELECT 1 FROM ${this.table} WHERE LOWER(${attr}) LIKE CONCAT('%', ${attrValue}, '%')`;

            pool.query(query, (error, response) => {
                if(error) reject(error);
                resolve(response.rows[0] === 1);
            });
        });
    }

}