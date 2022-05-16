import axios from 'axios'
import cheerio from 'cheerio'
import template from './template.js'
import fs from 'fs'

const courses = []

const fetchData = async () => {
  try {
    const { data } = await axios.get('https://wdaweb.github.io/')
    const $ = cheerio.load(data)
    $('#general .col-md-3').each(function () {
      courses.push(
        [
          'https://wdaweb.github.io/' + $(this).find('img').attr('src').slice(2),
          ...$(this).text().replace(/\t/g, '').split('\n').filter(text => text.length > 0)
        ]
      )
    })
  } catch (error) {
    console.log(error)
  }
}

const replyCourses = (event) => {
  const bubbles = courses.map(course => {
    const bubble = JSON.parse(JSON.stringify(template))
    bubble.hero.url = course[0]
    bubble.body.contents[0].text = course[1]
    bubble.body.contents[1].text = course[2]
    return bubble
  })
  fs.writeFileSync('bubbles.json', JSON.stringify(bubbles, null, 2))
  event.reply([
    {
      type: 'flex',
      altText: '共通課程',
      contents: {
        type: 'carousel',
        contents: bubbles.slice(0, 6)
      }
    }
  ])
}

export default {
  fetchData,
  courses,
  replyCourses
}
