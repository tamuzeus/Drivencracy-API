
import joi from 'joi';
import DateExtension from "@joi/date"
import JoiImport from 'joi';
import { db } from '../database/db.js'
import dayjs from 'dayjs';

const Joi = JoiImport.extend(DateExtension)

const pollSchema = joi.object({
    title: joi.string().empty(' ').required(),
    expireAt: Joi.date().min('now').format('YYYY-MM-DD HH:mm')
})

const newexpireAt = dayjs(dayjs().add(30, 'day')).format('YYYY-MM-DD HH:mm')

async function pollPost(req, res) {
    let { title, expireAt } = req.body

    try {
        
        const validation = pollSchema.validate(req.body, { abortEarly: false })

        if (validation.error) {
            const erros = validation.error.details.map(detail => detail.message);

            res.status(422).send(erros);
            return 
        }

        if(expireAt === null || expireAt === " " || !expireAt){
            const response = await db.collection('poll').insertOne(
                {
                    title,
                    expireAt: newexpireAt
                }
            )
        }else{
            const response = await db.collection('poll').insertOne(
                {
                    title,
                    expireAt
                }
            )
        }

        res.sendStatus(201);

    } catch (error) {
        res.status(500).send(error.message);
    }
}

async function pollGet(req, res) {
    try {
        const data = await db
            .collection('poll')
            .find().toArray();

        res.send(data)
    } catch (error) {
        res.sendStatus(500);
    }
}

export { pollPost, pollGet };