import IParseMailTemplateDTO from '../../MailTemplateProvider/dtos/IParseMailTemplateDTO';

interface IMailContactDTO {
  name: string;
  email: string;
}

export default interface ISendMailDTO {
  to: IMailContactDTO;
  from?: IMailContactDTO;
  subject: string;
  templateData: IParseMailTemplateDTO;
}
