
interface XMLHttpResponse
{
    response: any;
    status: number;
    type: XMLHttpRequestResponseType
}

class FileFetcher
{
    path: string;

    constructor(directory: string,  file: string, extension: string)
    {
        
        const validDirRegex: RegExp = /\/?[A-Za-z\-\_\.]+\/?/;
        const validFileRegex: RegExp = /[A-Za-z\-\_\.]+/;
        const validExtensionRegex: RegExp = /\.?[A-Za-z]+/;

        if(!validDirRegex.test(directory))
        {
            throw new Error("Invalid Directory String:\""+directory+"\"");
        }
        
        if(!validFileRegex.test(file))
        {
            throw new Error("Invalid File String:\""+directory+"\"");
        }
        
        if(!validExtensionRegex.test(extension))
        {
            throw new Error("Invalid Extension String:\""+directory+"\"");
        }

        if (!directory.endsWith("/"))
        {
            directory +="/"
        }

        if(!extension.startsWith("."))
        {
            extension = "." + extension;
        }

        this.path = directory + file + extension;
    }

    FetchFile() : XMLHttpResponse
    {
        let req : XMLHttpRequest = new XMLHttpRequest();
        req.open("GET", this.path, false);
        req.send(null);
        
        return {
            response: req.response,
            status: req.status,
            type: req.responseType
        };
    }
    
    FetchFileAsync() : Promise<Response>
    {
        return fetch(this.path);
    }
}

class VertexShaderFetcher extends FileFetcher
{
    constructor(shaderName: string)
    {
        super("shaders",shaderName,".vert");
    }

    GetShader(): string
    {
        let response : XMLHttpResponse = this.FetchFile();
        
        if(response.status != 200)
        {
            throw new Error(`Request returned with code: ${response.status}`);
        }
        
        if (response.type != "text" && response.type != "")
        {
            throw new Error("Response type error: Expected \"text\" but got \"" + response.type + "\"");
        }

        return (response.response as string);
    }

    GetShaderAsync(): Promise<string>
    {
        return this.FetchFileAsync().then(
            (value: Response) => {
                if (!value.ok)
                {
                    Promise.reject("Response was not OK");
                }
                return value.text();
            }
        );
    }
}

class FragmentShaderFetcher extends FileFetcher
{
    constructor(shaderName: string)
    {
        super("shaders",shaderName,".frag");
    }

    GetShader(): string
    {
        let response : XMLHttpResponse = this.FetchFile();
        
        if(response.status != 200)
        {
            throw new Error(`Request returned with code: ${response.status}`);
        }
        
        if (response.type != "text" && response.type != "")
        {
            throw new Error("Response type error: Expected \"text\" but got \"" + response.type + "\"");
        }

        return (response.response as string);
    }

    GetShaderAsync(): Promise<string>
    {
        return this.FetchFileAsync().then(
            (value: Response) => {
                if (!value.ok)
                {
                    Promise.reject("Response was not OK");
                }
                return value.text();
            }
        );
    }
}