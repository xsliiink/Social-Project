import {Response,Request} from 'express';
import  db  from '../db';
import sqlite3 from 'sqlite3';
import { EventBody, hobbyRow,EventRow } from '@shared/types';
import { AuthRequest } from '../types/index';
import { EventsQuery } from '@shared/types';

export const createEvent = async(req: AuthRequest & {body: EventBody}, res: Response) => {
    try{
            const {name,description,location,date} = req.body;
            const rawHobbies = req.body.selectedHobbies || req.body['selectedHobbies[]'] || [];
            const selectedHobbies: string[] = Array.isArray(rawHobbies) 
                ? rawHobbies 
                : (rawHobbies ? [rawHobbies] : []);

            const eventImage = req.file ? req.file.filename : null;
            const creator_id = req.user?.id;//проверка токена и юзера
            const official = 0;

            if (!req.user) {
                return res.status(401).json({ error: 'Unauthorized: You must be logged in' });
            }

            if(!name || !description || !date){
                return res.status(400).json({error:'Required fields are missing'});
            }
            
            const eventId = await new Promise<number>((resolve,reject) => {
                db.run(
                `INSERT INTO events (name,description,date,location,image,creator_id,official)
                VALUES (?,?,?,?,?,?,?)`,
                [name,description,date,location,eventImage,creator_id,official],
                function(this: sqlite3.RunResult, err: Error | null){
                    if(err){
                        console.error("🚨 Ошибка SQL events:", err.message);
                        reject(err);
                    }else{
                        console.log("✅ Событие создано, ID:", this.lastID);
                        resolve(this.lastID);
                    }
                })
            })

            if(selectedHobbies.length > 0){
                for (const hobbyName of selectedHobbies){
                    await new Promise<void>((resolve,reject) => {
                        db.get(`SELECT id FROM hobbies WHERE name = ?`, [hobbyName], (err: Error | null, row?: hobbyRow) => {
                        if (err) return reject(err);
                        if (row){
                            db.run(`INSERT INTO event_hobbies (event_id, hobby_id) VALUES (?,?)`,
                                [eventId, row.id], (runErr: Error | null) => {
                                if (runErr) reject(runErr);
                                else resolve();
                                });
                            }else{
                                resolve();  
                            }       
                        })
                    })
                }
            }

            return res.status(200).json({message: 'Event created', eventId});
    }catch(err: unknown){
            console.error('Error creating event: ',err);
           if (!res.headersSent) {
            const errorMessage = err instanceof Error ? err.message : 'Server error';
            res.status(500).json({ error: errorMessage });
        }
    }
}

           

export const getEvents = (req : Request<Record<string,never>,Record<string,never>,Record<string,never>,EventsQuery>,res: Response) => {
    const {location,hobby,official} = req.query;
    
        let query = `
            SELECT e.*, GROUP_CONCAT(h.name) as hobbies
            from events e
            LEFT JOIN event_hobbies eh ON e.id = eh.event_id
            LEFT JOIN hobbies h ON eh.hobby_id = h.id
            WHERE 1 = 1
        `;
    
        const params: (string | number)[] = [];
    
        if(location){
            query += ` AND e.location = ?`;
            params.push(location);
        }
    
        if(official){
            query += ` AND e.official = ?`;
            params.push(official === 'true' || official === '1' ? 1: 0);
        }
    
        if(hobby){
            query += ` AND h.name = ?`;
            params.push(hobby);
        }
    
    
        query += ` GROUP BY e.id ORDER BY e.date ASC`;
    
        db.all(query,params, (err: Error | null,rows: EventRow[]) => {
            if(err){
                console.error(err);
                return res.status(500).json({error : err.message});
            }
            
            const formatted = rows.map((r: EventRow) => ({
                ...r,
                hobbies: r.hobbies ? r.hobbies.split(',') : []
            }));
    
            console.log("🧠 Events before send:", formatted);
            res.json(formatted);
        })
}