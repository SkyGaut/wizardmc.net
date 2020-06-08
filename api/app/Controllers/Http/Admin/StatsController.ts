import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'

export default class StatsController {
  public async visits ({ response }: HttpContextContract) {
    let visits = await Database.from('statistics')
      .where('type_id', 0)
      .select(
        'id',
        'count',
        'created_at',
      )
      .orderBy('created_at', 'desc')
      .limit(14)

    visits.sort((a, b) => a.id - b.id)

    return response.json(visits)
  }

  public async registrations ({ response }: HttpContextContract) {
    const registrations = await Database
      .rawQuery('SELECT DATE(created_at) as registerDate, COUNT(id) as count FROM Users GROUP BY registerDate')

    return response.json(registrations)
  }

  public async players ({ response }: HttpContextContract) {
    let players = await Database.from('statistics')
      .where('type_id', 1)
      .select(
        'id',
        'count',
        'created_at',
      )
      .orderBy('created_at', 'desc')
      .limit(96) // 24h

    players.sort((a, b) => a.id - b.id)

    return response.json(players)
  }
}