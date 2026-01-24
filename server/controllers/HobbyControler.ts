import { Request,Response } from "express";
import db from "../db";
import { hobbyRow } from "../../shared/types";

export const getHobbies = (req: Request,res: Response) =>{
    db.all("SELECT * FROM hobbies",[], (err : Error | null,rows: hobbyRow[]) =>{
            console.log('Hobbies request received');
            if (err){
                    console.error('DB error:', err.message);
                    return res.status(500).json({error:"DB error"});
            }
            res.json(rows);
        })
}