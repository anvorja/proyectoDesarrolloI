
# from django.http import HttpResponse
# from django.template.loader import get_template

# """ import os
# from io import BytesIO
# from xhtml2pdf import pisa
# from pathlib import Path
# from django.conf import settings """

# # def render_to_pdf(context_dict):
# #     template = get_template("index.html")
# #     BASE_DIR = Path(__file__).resolve().parent.parent
# #     context_dict['path'] = os.path.join( BASE_DIR , 'static') 

# #     html  = template.render(context_dict)
# #     result = BytesIO()
# #     pdf = pisa.pisaDocument(BytesIO(html.encode("ISO-8859-1")), result, link_callback=link_callback)
    
    
# #     if not pdf.err:
# #         return HttpResponse(result.getvalue(), content_type='application/pdf')
# #     return None


# # def link_callback(uri, rel):
# #     """
# #     Convert HTML URIs to absolute system paths so xhtml2pdf can access those
# #     resources
# #     """
# #     # use short variable names
# #     sUrl = settings.STATIC_URL     # Typically /static/
# #     #static Root
# #     sRoot = settings.STATIC_ROOT    # Typically /home/userX/project_static/


# #     # convert URIs to absolute system paths
# #     if uri.startswith(sUrl):
# #         path = os.path.join(sRoot, uri.replace(sUrl, ""))
# #     else:
# #         return uri  # handle absolute uri (ie: http://some.tld/foo.png)

# #     # make sure that file exists
# #     if not os.path.isfile(path):
# #             raise Exception(
# #                 'media URI must start with %s or %s' % (sUrl, mUrl)
# #             )
# #     return path
# def render_invoice(context_dict):
#     template = get_template("index.html")
#     html  = template.render(context_dict)
#     return HttpResponse(html)