# AI-Powered PDF Field Mapping

## Overview

The AI Mapping feature uses GPT-4o-mini to automatically detect and suggest form field placements on uploaded PDF templates, significantly reducing the time required to create forms.

## Features

- **Automatic Field Detection**: AI analyzes PDF structure and suggests field names, types, and coordinates
- **Preview Mode**: AI suggestions appear in purple with dashed borders and confidence scores
- **Interactive Review**: Users can confirm all, remove individual fields, or clear all suggestions
- **Usage Limits**: 
  - Free tier: 1 PDF analysis
  - Pro tier: Unlimited analyses
- **Rate Limiting**: 5 requests per minute per user

## User Guide

### How to Use AI Field Generation

1. **Upload a PDF** and create a form
2. In the form builder, locate the **"AI Generate Fields"** button in the left panel
3. Click the button to generate common form fields (typically takes 5-10 seconds)
4. Review the purple AI-suggested fields on the PDF
5. **Drag fields** to match your PDF's actual layout
6. Options:
   - **Confirm All**: Convert all suggestions to permanent fields
   - **Clear All**: Remove all suggestions
   - **Individual Edit**: Click, drag, and resize fields as needed
7. Save your form once positioned correctly

**Note**: The current MVP generates standard form field templates (names, email, address, etc.) with typical positioning. You'll need to drag fields to match your specific PDF layout. Future versions will include OCR and vision-based analysis for automatic positioning.

### Field Types Detected

- Text input (names, addresses)
- Email addresses
- Numbers (phone, zip codes)
- Text areas (comments, descriptions)
- Checkboxes
- Dropdowns
- Signature fields

### Current Limitations (MVP)

**Important**: The current version generates **template fields** based on common form patterns, not actual PDF content analysis. Fields will need to be manually positioned to match your PDF.

- Generates standard field types (names, email, address, etc.)
- Suggests typical positioning (top-to-bottom layout)
- Does not read actual PDF text or field positions
- Requires manual drag-and-drop to align with PDF
- Maximum 20 fields per generation

### Future Enhancements for Accurate Detection

To achieve true automatic field detection with accurate positioning, the following would be needed:

1. **PDF.js Integration**: Extract actual text with coordinates
   ```typescript
   // Using pdf.js to get text positions
   const textContent = await page.getTextContent();
   const textItems = textContent.items.map(item => ({
       text: item.str,
       x: item.transform[4],
       y: item.transform[5],
       width: item.width,
       height: item.height
   }));
   ```

2. **Vision-Based Analysis**: Use GPT-4 Vision to see the PDF as an image
   - More accurate layout understanding
   - Detects visual patterns and field boundaries
   - 3-5x more expensive per request

3. **OCR + NLP**: For scanned PDFs without selectable text
   - Tesseract OCR for text extraction
   - NER (Named Entity Recognition) for field classification

## Technical Details

### API Endpoint

```
POST /api/pdfs/[id]/analyze
```

**Authentication**: Required (NextAuth session)

**Rate Limit**: 5 requests/minute

**Response**:
```json
{
  "success": true,
  "pdfName": "Form W-9.pdf",
  "pageCount": 1,
  "suggestions": [
    {
      "id": "ai-field-1234",
      "label": "First Name",
      "type": "text",
      "page": 1,
      "x": 50,
      "y": 100,
      "width": 150,
      "height": 25,
      "confidence": 0.85
    }
  ],
  "metadata": {
    "tokensUsed": 1500,
    "processingTime": 3200,
    "fieldsDetected": 8
  },
  "usage": {
    "current": 1,
    "limit": "unlimited"
  }
}
```

### Architecture

**Backend**:
- `/src/lib/ai/field-mapping.ts`: OpenAI integration and prompt engineering
- `/src/lib/pdf/extract.ts`: PDF metadata extraction
- `/src/app/api/pdfs/[id]/analyze/route.ts`: API endpoint with auth and rate limiting

**Frontend**:
- `/src/components/forms/ai-mapping-button.tsx`: UI controls
- `/src/components/forms/form-canvas.tsx`: Visual representation of AI suggestions

### Error Handling

The system handles various error scenarios:

1. **AI Service Unavailable**: Retries up to 3 times with exponential backoff
2. **Invalid PDF**: Returns user-friendly error message
3. **No Fields Detected**: Suggests manual mapping
4. **Timeout**: Cancels after 30 seconds
5. **Rate Limit Exceeded**: Returns 429 status

### Security

- API keys stored securely in environment variables
- Never exposed to client
- Authentication required for all requests
- Field coordinates validated against PDF boundaries
- Rate limiting prevents abuse

## Deployment Checklist

- [ ] Set `OPENAI_API_KEY` environment variable
- [ ] Run database migration for `aiMappingUsage` and `isSubscribed` fields
- [ ] Test with sample PDFs in staging
- [ ] Monitor AI API costs and response times
- [ ] Set up alerts for API failures

## Cost Considerations

**Estimated Costs** (GPT-4o-mini):
- ~1500-2000 tokens per analysis
- $0.00015 per 1K input tokens
- ~$0.0003 per PDF analysis
- Free tier limit helps control costs

**Monitoring**:
- Track token usage via `metadata.tokensUsed` in API response
- Set up daily budget alerts
- Monitor average processing time

## Troubleshooting

### "AI analysis failed"
- Check `OPENAI_API_KEY` is set correctly
- Verify API key has sufficient credits
- Check OpenAI service status

### "No fields detected"
- PDF may not have clear structure
- Try re-scanning the PDF
- Use manual field mapping

### "Rate limit exceeded"
- Wait 1 minute before retrying
- Contact support if persistent

### "Upgrade required"
- Free tier limit reached (1 PDF)
- Subscribe to Pro for unlimited access

## Future Enhancements

- Vision-based analysis (GPT-4 Vision) for complex layouts
- PDF result caching to reduce costs
- Batch analysis for multiple PDFs
- Custom field type training
- Multi-language support
