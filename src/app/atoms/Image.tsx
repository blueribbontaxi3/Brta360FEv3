export default function Image({src,alt,attributes}:any)
{
    return <>
    <img src={src} alt={alt} {...attributes}/>
    </>
}