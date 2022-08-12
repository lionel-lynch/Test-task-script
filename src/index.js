require('dotenv').config();       // подключаем возможность польоваться своими env-переменными
const fs = require('fs');         // модуль для работы с файловой системой
const path = require('path');     // модуль для работы с путями
const tinify = require("tinify"); // модуль для работы со сжатием изображений

const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp']; // допустимые для сжатия типы файлов
const origDirectoryName = 'assets';                         // название папки, откуда будем брать исходные изображения
const destDirectoryName = 'compressed-images';              // название папки, куда будем складывать сжатые изображения
tinify.key = process.env.TINIFY_API_KEY;                    // устанавливаем ключ для API (храним его в переменной окружения)

// если папка, в которую мы будем складывать сжатые изображения уже существует
if (fs.existsSync(path.join(__dirname, destDirectoryName))) {
    fs.rmSync(path.join(__dirname, destDirectoryName), {  // удаляем её
        recursive: true, // данный флаг выставляем, чтоб папка удалилась в любом случае, даже если в ней есть файлы
        force: true      // данный флаг выставляем, чтоб папка удалилась в любом случае, даже если в ней есть файлы
    });
}

// создаём папку, в которую будем складывать сжатые изображения
fs.mkdir(path.join(__dirname, destDirectoryName), (err) => {
    if (err) { // в случае ошибки, логируем её и завершаем работу скрипта
        console.log(err);
        throw err;
    }
});

// считываем файлы в папке, где расположены исходные картинки
fs.readdir(path.join(__dirname, origDirectoryName), (err, files) => {
    if (err) { // в случае ошибки, логируем её и уходим из выполняемой функции
        console.log(err);
        return;
    }
    
    // проходимся по всем файлам
    for (const file of files) {
        const fileSizeBytes = fs.statSync(path.join(__dirname, `${origDirectoryName}/${file}`)).size; // вычисляем размера файла
        const fileSizeKB = fileSizeBytes / 1024; // переводим размер файла в килобайты

        // если файл является картинкой с допустимым расширением (API принимает только .jpg, .png, .webp)
        // а также его размер более 100 килобайт
        if (imageExtensions.includes(path.extname(file)) && fileSizeKB > 100) {
            const source = tinify.fromFile(path.join(__dirname, `${origDirectoryName}/${file}`)); // сжимаем файл
            source.toFile(path.join(__dirname, `${destDirectoryName}/${file}`)); // и загружаем сжатый файл в папку с указанным названием
        }
    }
});