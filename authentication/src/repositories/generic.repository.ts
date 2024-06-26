import { QueryResultRow } from "pg";
import pool from "../config/db";

export abstract class GenericRepository<T>{

    protected table: string = '';
    private readonly query: string = `SELECT * FROM ${this.table}`;

    async getByAttributeEqualTo(attr: string, attrValue: string, buildObjectFunction: (row: QueryResultRow) => T | Promise<T>): Promise<T | null>{
        return new Promise((resolve, reject) => {
            const query = this.query.concat(` WHERE ${attr} = ${attrValue}`);

            pool.query(query, (error, response) => {
                if(error) reject(error);
                else if(response.rows.length > 0) resolve(buildObjectFunction(response.rows[0]));
            });
        });
    }

    async getByAttributeLikeAndIgnoreCase(attr: string, attrValue: string, buildObjectFunction: (row: QueryResultRow) => T | Promise<T>): Promise<T | null>{
        return new Promise((resolve, reject) => {
            const query = `${this.query} WHERE LOWER(${attr}) LIKE CONCAT('%', ${attrValue}, '%')`;

            pool.query(query, (error, response) => {
                if(error) reject(error);
                else if(response.rows.length > 0) resolve(buildObjectFunction(response.rows[0]));
            });
        });
    }

}