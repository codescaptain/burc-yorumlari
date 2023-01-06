const cheerio = require("cheerio");
const express = require("express");
const fetch = require("node-fetch");
const slugify = require("slugify");

API_URI_1 = "https://www.hurriyet.com.tr/mahmure/astroloji/{0}-burcu/" //burada günlük yorumları
API_URI_2 = "https://www.hurriyet.com.tr/mahmure/astroloji/{0}-burcu-{1}-yorum/" // burada get değerine göre burcun haftalık,aylık,yıllık yorumunu alacağız
API_URI_3 = "https://www.hurriyet.com.tr/mahmure/astroloji/burclar/{0}-burcu/{1}"
// gelecek degerler => AŞK,KARİYER,OLUMLU YONLER,SAĞLIK,STİL,ÜNLÜLER,DİYET,ZIT BURÇLARI,EĞLENCE HAYATİ, MAKYAJ, SAÇ STİLİ, ŞİFALI BİTKİLER, FİLM ÖNERİLERİ, ÇOCUKLUĞU, KADINI, ERKEĞİ

const app = express();


//Gunluk /get/burc

app.get("/get/:burc", async (req, res) => {
    var burc = req.params.burc;
    var datas = [];

    await fetch(API_URI_1.replace('{0}', slugify(burc)))
        .then(response => response.text())
        .then(body => {
            const $ = cheerio.load(body)
            $('div[class=main-wrapper]').each(function (i, e) {
                datas[i] = {
                    Burc: burc.charAt(0).toUpperCase() + burc.slice(1),
                    Mottosu: $(this)
                        .find('div[class=page] div div .region-type-1.col-12 .row.mb20 div div div[class=horoscope-menu-detail] ul li ')
                        .slice(0)
                        .eq(0)
                        .text()
                        .match(/(.*):\s\s(.*)/)[2],
                    Gezegeni: $(this)
                        .find('div[class=page] div div .region-type-1.col-12 .row.mb20 div div div[class=horoscope-menu-detail] ul li ')
                        .slice(0)
                        .eq(1)
                        .text()
                        .match(/(.*):\s\s(.*)/)[2],
                    Elementi: $(this)
                        .find('div[class=page] div div .region-type-1.col-12 .row.mb20 div div div[class=horoscope-menu-detail] ul li ')
                        .slice(0)
                        .eq(2)
                        .text()
                        .match(/(.*):\s\s(.*)/)[2],
                    GunlukYorum: $(this)
                        .find('div[class=page] div div .region-type-2.col-lg-8.col-md-12 div div div[class=horoscope-detail-content] div p')
                        .text()


                }

            })

        })

    res.send(datas);


})

//haftalik,aylik,yillik burc yorumları örnek olarak => .../get/aslan/haftalik
//gunluk yorum için herhangi bir değere gerek yoktur => /get/burc yeterlidir


app.get("/get/:burc/:zaman", async (req, res) => {
    var burc = req.params.burc;
    var zaman = req.params.zaman;
    var datas = [];

    await fetch(API_URI_2.replace('{0}', slugify(burc)).replace('{1}', slugify(zaman)))
        .then(response => response.text())
        .then(body => {
            const $ = cheerio.load(body)
            $('div[class=main-wrapper]').each(function (i, e) {
                datas[i] = {
                    Burc: burc.charAt(0).toUpperCase() + burc.slice(1),
                    Zaman: zaman.charAt(0).toUpperCase() + zaman.slice(1),
                    Mottosu: $(this)
                        .find('div[class=page] div div .region-type-1.col-12 .row.mb20 div div div[class=horoscope-menu-detail] ul li ')
                        .slice(0)
                        .eq(0)
                        .text()
                        .match(/(.*):\s\s(.*)/)[2],
                    Gezegeni: $(this)
                        .find('div[class=page] div div .region-type-1.col-12 .row.mb20 div div div[class=horoscope-menu-detail] ul li ')
                        .slice(0)
                        .eq(1)
                        .text()
                        .match(/(.*):\s\s(.*)/)[2],
                    Elementi: $(this)
                        .find('div[class=page] div div .region-type-1.col-12 .row.mb20 div div div[class=horoscope-menu-detail] ul li ')
                        .slice(0)
                        .eq(2)
                        .text()
                        .match(/(.*):\s\s(.*)/)[2],
                    Yorum: $(this)
                        .find('div[class=page] div div .region-type-2.col-lg-8.col-md-12 div div div[class=horoscope-detail-content] div p')
                        .text()


                }

            })

        })

    res.send(datas);


})


// Özeliklere Göre
// /gets/burc/ozellik => Dikkat etmemiz gereken nokta burada GET değil GETS kullandık
// gelecek degerler => AŞK,KARİYER,OLUMLU YONLER,SAĞLIK,STİL,ÜNLÜLER,DİYET,ZIT BURÇLARI,EĞLENCE HAYATİ, MAKYAJ, SAÇ STİLİ, ŞİFALI BİTKİLERi, FİLM ÖNERİLERİ, ÇOCUKLUĞU, KADINI, ERKEĞİ


app.get("/gets/:burc/:ozellik", async (req, res) => {
    var burc = req.params.burc;
    var ozellik = req.params.ozellik;
    var datas = [];

    await fetch(API_URI_3.replace('{0}', slugify(burc)).replace('{1}', slugify(ozellik)))

        .then(response => response.text())
        .then(body => {
            const $ = cheerio.load(body)
            $('.col-md-12.col-lg-8').each(function (i, e) {
                datas[i] = {
                    Burc: burc.charAt(0).toUpperCase() + burc.slice(1),
                    Ozellik: ozellik.charAt(0).toUpperCase() + ozellik.slice(1),
                    Baslik: $(this)
                        .find('div h2')
                        .text().match(/(.*)\"(.*)\.(.*)/)[2],
                    Yorum: $(this)
                        .find('div div p')
                        .text(),
                    Unluler: $(this)
                        .find('div div ul li')
                        .text(),

                }

            })

        })

    res.send(datas);


})


const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log("Sunucu ayakta")
})