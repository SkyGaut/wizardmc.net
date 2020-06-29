import { BaseCommand } from '@adonisjs/ace'
import { DateTime } from 'luxon'

export default class ResetVote extends BaseCommand {
  public static commandName = 'reset:vote'
  public static description = 'Command to reset and redeem rewards for players who has the more votes'

  public static settings = {
    loadApp: true,
  }

  private readonly multiplicators = [10, 7, 5]
  private readonly defMultiplicator = 2

  public async handle () {
    const Database = (await import('@ioc:Adonis/Lucid/Database')).default
    const User = (await import('App/Models/User')).default
    const Post = (await import('App/Models/Post')).default

    const bestVoters = await User.query().orderBy('votes', 'desc').limit(10)
    const rewarded: any[] = []

    for (let i = 0; i < bestVoters.length; i++) {
      const mulitiplicator = this.multiplicators[i] ?? this.defMultiplicator
      const user = bestVoters[i]
      const reward = Math.round(user.votes * mulitiplicator)

      this.logger.info(`User ${user.username} #${i + 1} has been credited of ${reward} credits with a total of ${user.votes} x ${mulitiplicator}`)

      // user.votes = 0
      // user.credits += reward
      // await user.save() ADD SAVE LATER TO ADD POINTS

      rewarded[i] = {
        user: user,
        reward: reward,
      }
    }

    const post = await Post.findOrFail(22)
    let postContent = post.content

    for (let i = 0; i < rewarded.length; i++) {
      postContent = postContent
        .replace(`{player_${i}}`, rewarded[i].user.username)
        .replace(`{reward_${i}}`, rewarded[i].reward)
    }

    let month = DateTime.local().minus({ day: 1 }).reconfigure({ locale: 'fr-FR' }).monthLong
    month = month.charAt(0).toUpperCase() + month.substr(1)

    postContent = postContent.replace('{month}', month)

    await Post.create({
      authorId: 4,
      title: post.title.replace('{month}', month),
      content: postContent,
      image: 'https://cloud.wizardmc.fr/posts/5gdywnSqXtD_ygmREiWecaZBp87Gb_0H.jpg',
      hidden: true,
    })

    await Database.manager.closeAll()

    this.logger.success('Reward finished.')
    // TODO MAKE NEWS WITH REWARDED OBJECTS 
  }
}
