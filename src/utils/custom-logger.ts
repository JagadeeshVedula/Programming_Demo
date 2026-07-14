import winston from 'winston'
import path from 'path'

export function createCustomLogger(testName:string):winston.Logger {
    const safeTestName = testName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const logPath = path.join(process.cwd(),"Logs",safeTestName+'.log')
    return winston.createLogger({
        level:'debug',
        format:winston.format.combine(
            winston.format.timestamp(),
            winston.format.printf(function(debug){
                return `${debug.timestamp}-[${debug.level.toUpperCase()}] - ${debug.message}]`
            })
        ),
        transports:[
            new winston.transports.Console({
                level:'info',
                format:winston.format.combine(
                winston.format.colorize(),
                winston.format.simple())
            }),
            new winston.transports.File({
                level:'debug',
                filename: logPath,
                options:{flags:'w'}
            })
        ]
            
    })
}