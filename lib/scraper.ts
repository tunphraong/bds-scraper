import type { NewsItem } from "./types"
import * as cheerio from "cheerio"
import puppeteer from "puppeteer"
// Cache the results to avoid excessive scraping
let cachedNews: Record<string, NewsItem[]> | null = null
let lastFetchTime = 0
const CACHE_DURATION = 1000 * 60 * 30 // 30 minutes

export async function scrapeRealEstateNews(): Promise<Record<string, NewsItem[]>> {
  // Return cached results if available and not expired
  const now = Date.now()
  if (cachedNews && now - lastFetchTime < CACHE_DURATION) {
    return cachedNews
  }

  try {
    // Array of news sources to scrape
    const sources = [
      {
        urls: [
          "https://cafef.vn/tp-nha-trang.html",
          "https://cafef.vn/tinh-khanh-hoa.html"
        ],
        scraper: scrapeCafef,
      },
      {
        urls: [
          "https://timkiem.vnexpress.net/?q=nha%20trang",
          "https://timkiem.vnexpress.net/?search_q=khanh%20hoa"
        ],
        scraper: scrapeVnExpress,
      },
      {
        urls: ["https://batdongsan.com.vn/tin-tuc/bat-dong-san-khanh-hoa"],
        scraper: scrapeBatDongSan,
      },
      // Add more sources as needed
    ]

    // Scrape all sources in parallel
    const newsPromises = sources.map((source) => 
      Promise.all(source.urls.map(url => source.scraper(url)))
    )
    const newsArrays = await Promise.all(newsPromises)

    // Group news by source and remove duplicates
    const newsBySource: Record<string, NewsItem[]> = {}
    const seenUrls = new Set<string>()

    newsArrays.forEach((newsArray, sourceIndex) => {
      const source = sources[sourceIndex].scraper.name.replace('scrape', '')
      const uniqueNews = newsArray
        .flat()
        .filter(news => {
          if (seenUrls.has(news.url)) return false
          seenUrls.add(news.url)
          return true
        })
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

      newsBySource[source] = uniqueNews
    })

    // Update cache
    cachedNews = newsBySource
    lastFetchTime = now

    return newsBySource
  } catch (error) {
    console.error("Error scraping news:", error)
    return cachedNews || {} // Return cached news on error, or empty object if no cache
  }
}

async function scrapeBatDongSan(url: string): Promise<NewsItem[]> {
  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36');
    
    await page.goto(url, { waitUntil: 'networkidle0' });
    const content = await page.content();
    await browser.close();

    const $ = cheerio.load(content);
    
    const news: NewsItem[] = []

    // Parse articles using partial class name matching
    $("[class*='ArticleCardLarge_articleWrapper']").each((_, element) => {
      const title = $(element).find("h3 a").text().trim()
      const url = $(element).find("h3 a").attr("href") || ""
      const imageUrl = $(element).find("[class*='ArticleCardLarge_mediaImage'] img").attr("src") || ""
      const summary = $(element).find("[class*='ArticleCardLarge_articleExcerpt']").text().trim()
      const date = $(element).find("[class*='ArticleCardLarge_articleDate']").text().trim()
      const location = "Khanh Hoa"
      
      // Get categories from tags
      const categories = $(element)
        .find("[class*='Tag_tagsItem']")
        .map((_, el) => $(el).text().trim())
        .get()
        .join(", ")

      if (title && url) {
        news.push({
          title,
          url: url.startsWith("http") ? url : `https://batdongsan.com.vn${url}`,
          imageUrl: imageUrl.startsWith("http") ? imageUrl : `https://batdongsan.com.vn${imageUrl}`,
          summary,
          date,
          source: "BatDongSan.com.vn",
          category: categories || "Real Estate",
          location,
        })
      }
    })

    return news
  } catch (error) {
    console.error("Error scraping BatDongSan:", error)
    return []
  }
}

async function scrapeCafefKhanhHoa(url: string): Promise<NewsItem[]> {
  try {
    const response = await fetch(url, { next: { revalidate: 3600 } })
    const html = await response.text()
    const $ = cheerio.load(html)
    const news: NewsItem[] = []

    // Find articles within the list-main container
    $(".list-main .tlitem").each((_, element) => {
      const title = $(element).find("h3 a").text().trim()
      const url = $(element).find("h3 a").attr("href") || ""
      const imageUrl = $(element).find(".avatar img").attr("src") || ""
      const summary = $(element).find(".sapo").text().trim()
      const date = $(element).find(".time").text().trim()
      const location = "Khanh Hoa"

      if (title && url) {
        news.push({
          title,
          url: url.startsWith("http") ? url : `https://cafef.vn${url}`,
          imageUrl: imageUrl.startsWith("http") ? imageUrl : `https://cafef.vn${imageUrl}`,
          summary,
          date,
          source: "Cafef.vn",
          category: "Real Estate",
          location,
        })
      }
    })

    return news
  } catch (error) {
    console.error("Error scraping Cafef:", error)
    return []
  }
}

async function scrapeCafef(url: string): Promise<NewsItem[]> {
  try {
    const response = await fetch(url, { next: { revalidate: 3600 } })
    const html = await response.text()
    const $ = cheerio.load(html)
    const news: NewsItem[] = []

    // Find articles within the list-main container
    $(".list-main .tlitem").each((_, element) => {
      const title = $(element).find("h3 a").text().trim()
      const url = $(element).find("h3 a").attr("href") || ""
      const imageUrl = $(element).find(".avatar img").attr("src") || ""
      const summary = $(element).find(".sapo").text().trim()
      const date = $(element).find(".time").text().trim()
      const location = "Khanh Hoa"

      if (title && url) {
        news.push({
          title,
          url: url.startsWith("http") ? url : `https://cafef.vn${url}`,
          imageUrl: imageUrl.startsWith("http") ? imageUrl : `https://cafef.vn${imageUrl}`,
          summary,
          date,
          source: "Cafef.vn",
          category: "Real Estate",
          location,
        })
      }
    })

    return news
  } catch (error) {
    console.error("Error scraping Cafef:", error)
    return []
  }
}

async function scrapeVnExpress(url: string): Promise<NewsItem[]> {
  try {
    const response = await fetch(url, { next: { revalidate: 3600 } })
    const html = await response.text()
    const $ = cheerio.load(html)
    const news: NewsItem[] = []

    // Find articles with the item-news class
    $(".item-news.item-news-common").each((_, element) => {
      const title = $(element).find(".thumb-art a").attr("title") || ""
      const url = $(element).attr("data-url") || ""
      // const imageUrl = $(element).find("img.lazy").attr("data-src") || ""
      const summary = $(element).find(".description").text().trim()
      const date = new Date(parseInt($(element).attr("data-publishtime") || "0") * 1000).toLocaleString()
      const location = "Khanh Hoa"

      if (title && (!title.includes('Nhà Trắng')) && url) {
        news.push({
          title,
          url: url.startsWith("http") ? url : `https://vnexpress.net${url}`,
          // imageUrl: imageUrl.startsWith("http") ? imageUrl : `https://vnexpress.net${imageUrl}`,
          summary,
          date,
          source: "VnExpress",
          category: "Real Estate",
          location,
        })
      }
    })

    return news
  } catch (error) {
    console.error("Error scraping VnExpress:", error)
    return []
  }
}

